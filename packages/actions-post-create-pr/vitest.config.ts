import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default defineConfig({
  test: {
    name: 'actions-post-create-pr',
    setupFiles: [resolve(__dirname, './test/msw.setup.ts')],
  },
});
