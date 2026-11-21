-- ゴミ箱のお知らせを「完全に削除」できるようにする（お試し版）
-- SQL Editor で1回だけ実行する。006 の実行後に使う。何度実行しても同じ結果になる。
--
-- 権限
--   approver（公開の権限がある人）だけが、ゴミ箱の中（status = 'trashed'）のお知らせを削除できる。
--   writer は削除できない。ゴミ箱の外のお知らせは、approver でも削除できない（先にゴミ箱へ移す）。
--   削除したお知らせは元に戻せない。
--
-- 添付（写真・PDF）
--   画面からお知らせを削除するとき、添付ファイルも Storage の仕組み（API）で消す。
--   そのために、approver だけが trial-media の posts/ の下のファイルを消せるようにする。
--   （005 の注記どおり、storage.objects を SQL で直接消すとファイル本体が残るため、SQL では消さない）

begin;

-- お知らせの削除：approver が、ゴミ箱の中のものだけ
grant delete on public.posts to authenticated;

drop policy if exists posts_delete_trashed on public.posts;
create policy posts_delete_trashed on public.posts
  for delete to authenticated
  using (public.is_approver() and status = 'trashed');

-- 添付ファイルの削除：approver が、trial-media の posts/ の下だけ
-- Storage の削除の API は、対象のファイルを読む権限（select）と消す権限（delete）の両方を求めるため、両方を付ける
drop policy if exists trial_media_select_approver on storage.objects;
create policy trial_media_select_approver on storage.objects
  for select to authenticated
  using (
    bucket_id = 'trial-media'
    and public.is_approver()
    and (storage.foldername(name))[1] = 'posts'
  );

drop policy if exists trial_media_delete on storage.objects;
create policy trial_media_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'trial-media'
    and public.is_approver()
    and (storage.foldername(name))[1] = 'posts'
  );

commit;

select policyname, cmd from pg_policies
where (schemaname = 'public' and tablename = 'posts') or (schemaname = 'storage' and policyname like 'trial_media%')
order by schemaname, policyname;
