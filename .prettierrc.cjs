/** @type {import('prettier').Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  singleQuote: true,
  htmlWhitespaceSensitivity: 'ignore',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
