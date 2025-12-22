/** @type {import('prettier').Config}} */
const config = {
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  singleQuote: true,
  htmlWhitespaceSensitivity: 'ignore',
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};

export default config;
