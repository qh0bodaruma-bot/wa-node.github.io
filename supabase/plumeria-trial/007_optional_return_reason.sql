-- 差し戻しの理由を任意にする（お試し版）
-- SQL Editor で1回だけ実行する。006 の実行後に使う。何度実行しても同じ結果になる。
--
-- 変更点
--   006 の posts_before_update から「差し戻すときは理由が必須」の制限だけを外す。
--   理由が空（空白だけを含む）で差し戻したときは、理由を空（null）にして保存する。
--   それ以外の制限（権限・ゴミ箱の出し入れなど）は 006 のまま。

begin;

-- 更新時の制限（006 の内容から、差し戻しの理由の必須だけを外したもの）
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

  -- ここから下は 006 と同じ（ゴミ箱の項目は画面から変えられないようにする）。差し戻しの理由の必須だけをやめた
  new.trashed_from := old.trashed_from;
  new.trashed_at := old.trashed_at;
  new.trashed_by := old.trashed_by;

  if public.is_approver() then
    -- 差し戻しの理由は任意（007 で必須をやめた）。空のときは理由なしで戻す
    if new.status = 'returned' and coalesce(btrim(new.return_reason), '') = '' then
      new.return_reason := null;
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

commit;
