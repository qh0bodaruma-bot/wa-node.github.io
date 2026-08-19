import { spawnSync } from 'node:child_process';

// デプロイ対象。ここが唯一の定義。
// public/ を外すと、新規追加した画像・favicon 等が push されず本番で 404 になる（TRB-202608-006）。
// dist/ と business-docs/private/ は .gitignore で除外済みのため列挙しない。
const deployPaths = [
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

// -A で、対象ディレクトリ内の削除も含めてステージする
run('git', [...gitBaseArgs, 'add', '-A', '--', ...deployPaths]);

// 変更が無ければ commit は失敗する。その場合は push せず正常終了。
const committed = run('git', [...gitBaseArgs, 'commit', '-m', 'deploy'], { allowFailure: true });
if (committed !== 0) {
  console.log('\nコミットする変更がありません。すでにデプロイ済みです。');
  process.exit(0);
}

run('git', [...gitBaseArgs, 'push', 'origin', 'main']);
