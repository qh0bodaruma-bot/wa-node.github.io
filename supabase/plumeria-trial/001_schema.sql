-- プルメリア管理画面 お試し版（2名・2週間）のデータベース定義
-- Supabase の SQL Editor に貼り付けて1回だけ実行する。
-- 秘密情報は含まない。利用者のメールアドレスはこのファイルに書かない（002 を参照）。
--
-- 権限の考え方
--   anon（ログインしていない閲覧者）: 空室と、公開日を過ぎた公開中のお知らせだけ読める
--   authenticated（ログインした人）: profiles に登録された人だけが読み書きできる
--   writer: お知らせの下書き・最終確認への送付、空室の切替
--   approver: writer の操作に加えて、公開・差し戻し・非公開

begin;

-- ============ 利用者 ============
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 20),
  role text not null check (role in ('writer', 'approver'))
);

create or replace function public.has_profile()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

create or replace function public.is_approver()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'approver');
$$;

-- ============ 空室 ============
create table public.vacancies (
  facility text primary key,
  name text not null,
  sub text not null,
  sort int not null,
  state text not null check (state in ('空きあり', '残りわずか', '満室')),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id)
);

create table public.vacancy_log (
  id bigint generated always as identity primary key,
  facility text not null references public.vacancies (facility),
  from_state text,
  to_state text not null,
  changed_by uuid references public.profiles (id),
  changed_at timestamptz not null default now()
);

-- 更新者と日時はサーバー側で決める（画面から偽れないようにする）
create or replace function public.vacancies_before_update()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.facility := old.facility;
  new.name := old.name;
  new.sub := old.sub;
  new.sort := old.sort;
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

create or replace function public.vacancies_after_update()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.state is distinct from old.state then
    insert into public.vacancy_log (facility, from_state, to_state, changed_by)
    values (new.facility, old.state, new.state, auth.uid());
  end if;
  return null;
end;
$$;

create trigger vacancies_before_update before update on public.vacancies
  for each row execute function public.vacancies_before_update();
create trigger vacancies_after_update after update on public.vacancies
  for each row execute function public.vacancies_after_update();

insert into public.vacancies (facility, name, sub, sort, state) values
  ('plumeria1', 'プルメリアⅠ', 'サービス付き高齢者向け住宅', 1, '空きあり'),
  ('plumeria2', 'プルメリアⅡ', 'サービス付き高齢者向け住宅', 2, '満室'),
  ('plumeria3', 'プルメリアⅢ', 'ショートステイ', 3, '残りわずか');

-- ============ お知らせ（採用情報・コンプライアンス掲示も種類で兼ねる） ============
create table public.posts (
  id bigint generated always as identity primary key,
  category text not null check (category in ('お知らせ', '事業課からの通知', '採用情報', 'コンプライアンス掲示')),
  title text not null check (char_length(title) between 1 and 100),
  body text not null check (char_length(body) between 1 and 5000),
  targets text[] not null default '{}',
  publish_on date not null default current_date,
  status text not null default 'draft'
    check (status in ('draft', 'pending', 'published', 'returned', 'hidden')),
  return_reason text check (return_reason is null or char_length(return_reason) <= 500),
  author_id uuid not null default auth.uid() references public.profiles (id),
  approver_id uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

-- 作成時: 作成者は本人に固定し、いきなり公開はできない
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
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$$;

-- 更新時: 状態の移り変わりを権限ごとに制限する
create or replace function public.posts_before_update()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.id := old.id;
  new.author_id := old.author_id;
  new.created_at := old.created_at;

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

create trigger posts_before_insert before insert on public.posts
  for each row execute function public.posts_before_insert();
create trigger posts_before_update before update on public.posts
  for each row execute function public.posts_before_update();

-- ============ 行単位の制限（RLS） ============
alter table public.profiles enable row level security;
alter table public.vacancies enable row level security;
alter table public.vacancy_log enable row level security;
alter table public.posts enable row level security;

create policy profiles_read on public.profiles
  for select to authenticated using (public.has_profile());

create policy vacancies_read on public.vacancies
  for select to anon, authenticated using (true);
create policy vacancies_update on public.vacancies
  for update to authenticated using (public.has_profile()) with check (public.has_profile());

create policy vacancy_log_read on public.vacancy_log
  for select to authenticated using (public.has_profile());

create policy posts_public_read on public.posts
  for select to anon using (status = 'published' and publish_on <= current_date);
create policy posts_member_read on public.posts
  for select to authenticated using (public.has_profile());
create policy posts_insert on public.posts
  for insert to authenticated with check (public.has_profile());
create policy posts_update on public.posts
  for update to authenticated using (public.has_profile()) with check (public.has_profile());
-- 削除は許可しない（掲載を終えるときは「非公開」にする）

-- ============ 表ごとの許可（新しい表を自動公開しない設定のため明示する） ============
revoke all on public.profiles, public.vacancies, public.vacancy_log, public.posts from anon, authenticated;

grant select on public.vacancies to anon, authenticated;
grant update (state) on public.vacancies to authenticated;
grant select on public.vacancy_log to authenticated;
grant select on public.profiles to authenticated;

grant select (id, category, title, body, targets, publish_on, published_at) on public.posts to anon;
grant select on public.posts to authenticated;
grant insert (category, title, body, targets, publish_on, status) on public.posts to authenticated;
grant update (category, title, body, targets, publish_on, status, return_reason) on public.posts to authenticated;

revoke all on function public.has_profile(), public.is_approver() from public;
grant execute on function public.has_profile(), public.is_approver() to anon, authenticated;

commit;
