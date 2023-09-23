import { MeetupFormValues } from 'meetup-shared';
import { FrontMeetups } from './get-meetups';

export const checkMeetupData = (meetup: MeetupFormValues) => {
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

export const getNextMeetup = (meetups: FrontMeetups) => {
  if (!meetups || meetups.length === 0) return null;

  const currentDate = new Date();
  const futureMeetups = meetups.filter((meetup) => {
    return +meetup.date > +currentDate;
  });

  if (futureMeetups.length === 0) return null;

  const sorted = sortMeetupsNewestFirst(futureMeetups);

  return sorted[0];
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

export function sortMeetupsNewestFirst(meetups: FrontMeetups) {
  return [...meetups].sort((a, b) => +b.date - +a.date);
}
