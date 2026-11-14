-- お知らせに写真・PDFを添付できるようにする（お試し版）
-- SQL Editor で1回だけ実行する。001・003 の実行後に使う。
--
-- 置き場（バケット）: trial-media（公開読み取り。ファイルのURLを知っていれば誰でも見られる）
-- 置ける場所: posts/<自分の利用者ID>/... だけ。ログインして表示名と権限が登録された人だけが置ける
-- 置けるもの: JPEG・PNG・WebP・PDF、1ファイル5MBまで
-- 削除: 画面からは削除しない。お試し終了時は Supabase の Storage 画面で置き場を空にする
--       （storage.objects を SQL で消すと、ファイル本体が残るため使わない）

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('trial-media', 'trial-media', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists trial_media_insert on storage.objects;
create policy trial_media_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'trial-media'
    and public.has_profile()
    and (storage.foldername(name))[1] = 'posts'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- お知らせ側に添付の一覧を持たせる（[{ "path": "...", "name": "...", "type": "image" | "pdf" }]）
alter table public.posts
  add column if not exists attachments jsonb not null default '[]'::jsonb;

alter table public.posts drop constraint if exists posts_attachments_check;
alter table public.posts add constraint posts_attachments_check check (
  jsonb_typeof(attachments) = 'array' and jsonb_array_length(attachments) <= 10
);

grant select (attachments) on public.posts to anon;
grant insert (attachments), update (attachments) on public.posts to authenticated;

commit;
