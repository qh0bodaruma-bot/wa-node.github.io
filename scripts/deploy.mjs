import { spawnSync } from 'node:child_process';

// デプロイ対象。ここが唯一の定義。
// public/ を外すと、新規追加した画像・favicon 等が push されず本番で 404 になる（TRB-202608-006）。
// dist/ と business-docs/private/ は .gitignore で除外済みのため列挙しない。
const deployPaths = [
  // GitHub Actions の公開手順も本番構成。ここを外すと workflow の改善が push されない。
  '.github',
  'src',
  'public',
  'scripts',
  'astro.config.mjs',
  'package.json',
  // CI の npm ci は package.json と lockfile の一致を要求する。片方だけ push すると公開が止まる。
  'package-lock.json',
  'tsconfig.json',
  'wrangler.jsonc',
];

const gitBaseArgs = ['-c', 'gc.auto=0', '-c', 'maintenance.auto=false'];

function run(command, args, { allowFailure = false } = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: false });
  if (!allowFailure && result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  return result.status ?? 1;
}

// このスクリプトは常に「ローカルの main」を push する。
// main 以外で作業していると、その内容は送られないまま push が成功し、
// 「デプロイしたのに反映されない」になる（TRB-202608-013）。先に止める。
const branch = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
  encoding: 'utf8',
}).stdout.trim();

if (branch !== 'main') {
  console.error(`\n現在のブランチは ${branch} です。このスクリプトは main を push します。`);
  console.error('main に切り替えるか、変更を main へ取り込んでから実行してください。');
  process.exit(1);
}

// -A で、対象ディレクトリ内の削除も含めてステージする
run('git', [...gitBaseArgs, 'add', '-A', '--', ...deployPaths]);

// 変更が無ければ commit は失敗する。ただし「コミット済みだが未 push」の状態が
// ありうるため、ここで終了せず push まで進める。push するものが無ければ
// git が Everything up-to-date と言って何もしない。
const committed = run('git', [...gitBaseArgs, 'commit', '-m', 'deploy'], { allowFailure: true });
if (committed !== 0) {
  console.log('\n新しくコミットする変更はありません。未 push の分がないか確認します。');
}

// 別の作業（プルメリアなど）が先に push していると、push は non-fast-forward で断られる。
// push の前に GitHub の main を取り込み、手元のコミットをその後ろに付け直す。
// 作業中の未コミットの変更は --autostash で一時退避し、付け直したあとに戻す。
run('git', [...gitBaseArgs, 'fetch', 'origin', 'main']);
const behind = Number(
  spawnSync('git', ['rev-list', '--count', 'HEAD..origin/main'], { encoding: 'utf8' }).stdout.trim() || '0',
);
if (behind > 0) {
  console.log(`\nGitHub 側に、手元に無いコミットが ${behind} 件あります。取り込んでから push します。`);
  const rebased = run('git', [...gitBaseArgs, 'rebase', '--autostash', 'origin/main'], { allowFailure: true });
  if (rebased !== 0) {
    // 同じファイルを両方で変更していて自動で合わせられない場合は、取り込む前の状態に戻して止める
    const conflicted = spawnSync('git', ['diff', '--name-only', '--diff-filter=U'], { encoding: 'utf8' }).stdout.trim();
    run('git', [...gitBaseArgs, 'rebase', '--abort'], { allowFailure: true });
    console.error('\nGitHub 側の変更と、手元の変更が同じ箇所でぶつかりました。push は行っていません。');
    if (conflicted) console.error(`ぶつかったファイル:\n  ${conflicted.split('\n').join('\n  ')}`);
    console.error('取り込む前の状態に戻してあります。上のファイルの変更を手で合わせてから、もう一度実行してください。');
    process.exit(1);
  }
}

run('git', [...gitBaseArgs, 'push', 'origin', 'main']);
