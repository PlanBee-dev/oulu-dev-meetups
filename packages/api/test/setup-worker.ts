import { ChildProcess, exec } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../');

let subprocess: ChildProcess;

export async function setup() {
  log('Starting worker');
  subprocess = exec('pnpm dev --env test', { cwd: root });

  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('Timeout waiting for "pnpm dev" (worker)')),
      10_000,
    );

    subprocess.stdout?.on('data', (data: Buffer) => {
      if (data.toString().includes('Ready on http://127.0.0.1:8787')) {
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
  log('Stopping worker');

  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () =>
        reject(new Error('Timeout waiting for "pnpm dev" to exit (worker)')),
      10_000,
    );
    subprocess.on('exit', () => {
      clearTimeout(timer);
      resolve(null);
    });
  });
}

function log(...messages: Parameters<typeof console.log>) {
  console.log('[global-setup (worker)]', ...messages);
}
