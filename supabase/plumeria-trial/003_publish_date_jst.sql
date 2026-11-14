-- 公開日の判定を日本時間にそろえる（001 は UTC の日付で判定していたため、朝9時前は「今日」の公開分が出なかった）
-- SQL Editor で1回だけ実行する。何度実行しても同じ結果になる。

begin;

alter table public.posts
  alter column publish_on set default ((now() at time zone 'Asia/Tokyo')::date);

drop policy if exists posts_public_read on public.posts;
create policy posts_public_read on public.posts
  for select to anon
  using (status = 'published' and publish_on <= (now() at time zone 'Asia/Tokyo')::date);

commit;
