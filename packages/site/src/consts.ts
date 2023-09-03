// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Oulu developer meetups';
export const SITE_DESCRIPTION = 'Listing of developer meetups in Oulu area';

export const getRandomLogonumber = () => {
  const allowedNums = [1, 2, 3, 4, 5];
  let devLogoNum = Math.floor(Math.random() * 5) + 1;
  if (!allowedNums.includes(devLogoNum)) {
    devLogoNum = 1;
  }
  return devLogoNum;
};
