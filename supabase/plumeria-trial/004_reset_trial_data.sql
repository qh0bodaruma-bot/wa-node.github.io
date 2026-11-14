-- お試しデータを初期状態に戻す（和-Node の動作確認のあと、責任者の方へ URL を渡す前に実行する）
-- 消えるもの：お知らせすべて・空室の変更記録すべて。空室は初期値に戻す。
-- 消えないもの：利用者のアカウントと表示名・権限。
-- 取り消しできないため、実行前に対象のプロジェクト（plumeria-trial）であることを確かめる。

begin;

truncate table public.posts restart identity;

update public.vacancies set state = v.state
from (values ('plumeria1', '空きあり'), ('plumeria2', '満室'), ('plumeria3', '残りわずか')) as v(facility, state)
where public.vacancies.facility = v.facility;

-- 上の更新で記録が増えるため、最後に記録を空にする（更新者は SQL Editor では空になる）
truncate table public.vacancy_log restart identity;

commit;

select facility, state, updated_by from public.vacancies order by sort;
select count(*) as posts from public.posts;
select count(*) as vacancy_log from public.vacancy_log;
