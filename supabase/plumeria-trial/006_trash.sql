-- お知らせを「ゴミ箱」に移せるようにする（お試し版）
-- SQL Editor で1回だけ実行する。001・003・005 の実行後に使う。何度実行しても同じ結果になる。
--
-- 考え方
--   ゴミ箱に移しても行は消さない（status = 'trashed'）。いつでも元に戻せる。
--   完全に消す操作は用意しない（お試し終了時に 004 か、プロジェクトの削除で消える）。
--
-- 権限
--   approver: どの状態のお知らせもゴミ箱に移せる・戻せる（公開中・非公開を含む）
--   writer:   自分が書いた下書き・差し戻しだけをゴミ箱に移せる・戻せる
--
-- 戻すときの状態
--   ゴミ箱に移す前の状態に戻す。ただし公開中だったものは「非公開」で戻す
--   （戻した瞬間にホームページへ再び出ないようにするため）。

begin;

alter table public.posts drop constraint if exists posts_status_check;
alter table public.posts add constraint posts_status_check
  check (status in ('draft', 'pending', 'published', 'returned', 'hidden', 'trashed'));

alter table public.posts
  add column if not exists trashed_from text,
  add column if not exists trashed_at timestamptz,
  add column if not exists trashed_by uuid;

alter table public.posts drop constraint if exists posts_trashed_from_check;
alter table public.posts add constraint posts_trashed_from_check
  check (trashed_from is null or trashed_from in ('draft', 'pending', 'published', 'returned', 'hidden'));

alter table public.posts drop constraint if exists posts_trashed_by_fkey;
alter table public.posts add constraint posts_trashed_by_fkey
  foreign key (trashed_by) references public.profiles (id);

-- 更新時: 001 の制限に、ゴミ箱への出し入れを加える
create or replace function public.posts_before_update()
returns trigger
language plpgsql set search_path = ''
as $$
declare
  to_trash boolean := new.status = 'trashed' and old.status is distinct from 'trashed';
  from_trash boolean := old.status = 'trashed' and new.status is distinct from 'trashed';
begin
  new.id := old.id;
  new.author_id := old.author_id;
  new.created_at := old.created_at;

  -- ゴミ箱の中身は直せない。戻すときも中身は変えない
  if old.status = 'trashed' and not from_trash then
    raise exception 'ゴミ箱の中のお知らせは直せません。戻してから直してください';
  end if;

  if to_trash or from_trash then
    if not public.is_approver() then
      if old.author_id is distinct from auth.uid() then
        raise exception 'ほかの方のお知らせはゴミ箱に移せません';
      end if;
      if to_trash and old.status not in ('draft', 'returned') then
        raise exception '最終確認まち・公開中のお知らせは、公開の権限をお持ちの方だけがゴミ箱に移せます';
      end if;
      if from_trash and old.trashed_from not in ('draft', 'returned') then
        raise exception 'このお知らせは、公開の権限をお持ちの方だけが戻せます';
      end if;
    end if;

    new.category := old.category;
    new.title := old.title;
    new.body := old.body;
    new.targets := old.targets;
    new.publish_on := old.publish_on;
    new.attachments := old.attachments;
    new.return_reason := old.return_reason;
    new.approver_id := old.approver_id;
    new.published_at := old.published_at;

    if to_trash then
      new.trashed_from := old.status;
      new.trashed_at := now();
      new.trashed_by := auth.uid();
    else
      new.status := case when old.trashed_from = 'published' then 'hidden'
                         else coalesce(old.trashed_from, 'draft') end;
      new.trashed_from := null;
      new.trashed_at := null;
      new.trashed_by := null;
    end if;

    new.updated_at := now();
    return new;
  end if;

  -- ここから下は 001 と同じ（ゴミ箱の項目は画面から変えられないようにする）
  new.trashed_from := old.trashed_from;
  new.trashed_at := old.trashed_at;
  new.trashed_by := old.trashed_by;

  if public.is_approver() then
    if new.status = 'returned' and coalesce(btrim(new.return_reason), '') = '' then
      raise exception '差し戻すときは理由を入力してください';
    end if;
    if new.status = 'published' and old.status is distinct from 'published' then
      new.approver_id := auth.uid();
      new.published_at := now();
    else
      new.approver_id := old.approver_id;
      new.published_at := old.published_at;
    end if;
  else
    if old.author_id is distinct from auth.uid() then
      raise exception 'ほかの方の投稿は編集できません';
    end if;
    if old.status not in ('draft', 'returned') then
      raise exception '最終確認まち・公開中の投稿は編集できません';
    end if;
    if new.status not in ('draft', 'pending') then
      raise exception '公開の操作は最終確認の担当の方だけができます';
    end if;
    new.approver_id := old.approver_id;
    new.published_at := old.published_at;
    new.return_reason := old.return_reason;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

-- 新しいお知らせに、ゴミ箱の項目を入れさせない
create or replace function public.posts_before_insert()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.author_id := auth.uid();
  if new.status not in ('draft', 'pending') then
    raise exception '新しい投稿は下書きか最終確認まちで保存してください';
  end if;
  new.approver_id := null;
  new.return_reason := null;
  new.published_at := null;
  new.trashed_from := null;
  new.trashed_at := null;
  new.trashed_by := null;
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$$;

-- 公開側（anon）は status = 'published' だけを読むため、ゴミ箱の中身は外から見えない（001・003 の設定のまま）。
-- ログインした人は表全体を読める（001 の grant select）。新しい3項目も同じ扱いになる。

commit;

select status, count(*) from public.posts group by status order by status;
