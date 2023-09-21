// place any helper functions here
export type Meetup = {
  data: {
    title: string;
    description: string;
    date: string;
    time?: string;
    location: string;
    locationLink: string | null;
    organizer: string;
    organizerLink: string | null;
    signupLink: string;
    image?: string | null;
  };
  slug: string;
  body: string;
};

export const checkMeetupData = (meetup: Meetup['data']) => {
  if (!meetup) return;
  if (meetup.organizerLink && !meetup.organizerLink.startsWith('http')) {
    meetup.organizerLink = `https://${meetup.organizerLink}`;
  }
  if (meetup.signupLink && !meetup.signupLink.startsWith('http')) {
    meetup.signupLink = `https://${meetup.signupLink}`;
  }
  if (!meetup.locationLink && !!meetup.location) {
    const addressData = meetup.location.split(' ');
    if (addressData.length > 1) {
      meetup.locationLink = `https://www.google.com/maps/place/${addressData[0]}+${addressData[1]},+Oulu+Finland`;
    } else {
      meetup.locationLink = `https://www.google.com/maps/place/${addressData[0]},+Oulu+Finland`;
    }
  }
};

export const getRandomLogonumber = () => {
  const allowedNums = [1, 2, 3, 4, 5];
  let devLogoNum = Math.floor(Math.random() * 5) + 1;
  if (!allowedNums.includes(devLogoNum)) {
    devLogoNum = 1;
  }
  return devLogoNum;
};

export const parseDate = (meetup: Meetup) => {
  //date from dd.MM.YYYY to YYYY-MM-DD
  const date = meetup.data.date.split('.').reverse().join('-');
  return Date.parse(`${date} ${meetup.data.time}`);
};

export const getNextMeetup = (meetups: Meetup[]) => {
  if (!meetups || meetups.length === 0) return null;

  const currentDate = new Date();
  const futureMeetups = meetups.filter((meetup: Meetup) => {
    return parseDate(meetup) > currentDate.getTime();
  });

  if (futureMeetups.length === 0) return null;

  futureMeetups.sort((a: Meetup, b: Meetup) => {
    return parseDate(a) - parseDate(b);
  });
  return futureMeetups[0];
};

export const createShortDescription = (descriptionToCut: string) => {
  const description = descriptionToCut.trimStart();

  let shortDesc =
    description.length > 150
      ? description.substring(0, 150) + '...'
      : description;
  if (shortDesc.startsWith('#')) {
    shortDesc = shortDesc.substring(description.indexOf(' ') + 1);
  }
  return shortDesc;
};
