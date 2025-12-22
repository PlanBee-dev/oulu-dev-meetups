import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, preview } from 'astro';

let server: Awaited<ReturnType<typeof preview>>;

const __filename = fileURLToPath(import.meta.url);
const root = resolve(__filename, '../..');

export async function setup() {
  log('Building astro site');
  await build({ root });

  const timer = setTimeout(() => {
    throw new Error('Timeout waiting for Astro preview');
  }, 10_000);

  log('Starting Astro server 🚀');
  server = await preview({ root });

  clearTimeout(timer);
}

export async function teardown() {
  const timer = setTimeout(() => {
    throw new Error('Timeout waiting for Astro server to stop');
  }, 10_000);

  log('Stopping astro server');
  await server.stop();

  clearTimeout(timer);
}

function log(...messages: unknown[]) {
  console.log('[global-setup]', ...messages);
}
