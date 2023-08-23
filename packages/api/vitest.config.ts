import { defineConfig } from 'vitest/config';

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default defineConfig({
  test: {
    name: 'api',
    testTimeout: 40000,
    setupFiles: [resolve(__dirname, './test/msw.setup.ts')],
  },
});
