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

run('git', [...gitBaseArgs, 'push', 'origin', 'main']);
