/** @type {import('prettier').Config} */
module.exports = {
  plugins: [
    require.resolve('prettier-plugin-astro'),
    require.resolve('prettier-plugin-tailwindcss'),
  ],
  singleQuote: true,
  htmlWhitespaceSensitivity: 'ignore',
  endOfLine: "auto",
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
