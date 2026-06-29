import { spawnSync } from 'node:child_process';

const gitBaseArgs = ['-c', 'gc.auto=0', '-c', 'maintenance.auto=false'];

const deployPaths = [
  'src',
  'public',
  'scripts',
  'astro.config.mjs',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'deploy.bat',
];

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('git', [...gitBaseArgs, 'add', ...deployPaths]);
run('git', [...gitBaseArgs, 'commit', '-m', '更新', '--allow-empty']);
run('git', [...gitBaseArgs, 'push', 'origin', 'main']);
