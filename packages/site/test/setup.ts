import { ChildProcess, exec, execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../');

let subprocess: ChildProcess;

export async function setup() {
  log('Building astro site');
  execSync('pnpm build', { cwd: root });

  log('Starting astro server');
  subprocess = exec('pnpm preview', { cwd: root });

  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('Timeout waiting for "pnpm preview"')),
      10_000,
    );

    subprocess.stdout?.on('data', (data: Buffer) => {
      if (data.toString().includes('started in')) {
        clearTimeout(timer);
        resolve(null);
      }
    });

    subprocess.stderr?.on('data', (data: Buffer) => {
      reject(data.toString());
    });
  });
}

export async function teardown() {
  subprocess.kill();
  log('Stopping astro server');

  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('Timeout waiting for "pnpm preview" to exit')),
      10_000,
    );
    subprocess.on('exit', () => {
      clearTimeout(timer);
      resolve(null);
    });
  });
}

function log(...messages: Parameters<typeof console.log>) {
  console.log('[global-setup]', ...messages);
}
