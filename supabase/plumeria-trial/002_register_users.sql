-- お試し版の利用者2名に、表示名と権限を付ける
-- 先に Supabase の Authentication で2名のユーザーを作成してから、SQL Editor で実行する。
-- メールアドレスは SQL Editor 上でだけ書き換え、このファイルには保存しない（リポジトリは public）。
-- 表示名は画面の「担当」欄に出る名前（例: 山本）。

insert into public.profiles (id, display_name, role)
select id, '書く方の表示名', 'writer' from auth.users where email = '書く方のメールアドレス'
union all
select id, '承認する方の表示名', 'approver' from auth.users where email = '承認する方のメールアドレス';

-- 2行入ったかの確認（結果に2行出れば成功）
select p.display_name, p.role from public.profiles p;
