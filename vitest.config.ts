import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*'],
    reporters: process.env.CI ? 'default' : 'verbose',
    onConsoleLog(message, level) {
      if (
        level === 'stderr' &&
        ['Invalid JSON - ', 'Failed to create issue -'].some((str) =>
          message.includes(str),
        )
      ) {
        return false;
      }
    },
  },
});
