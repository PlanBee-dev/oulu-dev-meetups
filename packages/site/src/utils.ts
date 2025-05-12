import { type MeetupFormValues } from 'meetup-shared';
import { type FrontMeetups } from './get-meetups';

export const formatMeetupData = (meetup: MeetupFormValues) => {
  const formattedMeetup = structuredClone(meetup);

  if (
    formattedMeetup.organizerLink &&
    !formattedMeetup.organizerLink.startsWith('http')
  ) {
    formattedMeetup.organizerLink = `https://${formattedMeetup.organizerLink}`;
  }
  if (
    formattedMeetup.signupLink &&
    !formattedMeetup.signupLink.startsWith('http')
  ) {
    formattedMeetup.signupLink = `https://${formattedMeetup.signupLink}`;
  }
  if (!formattedMeetup.locationLink && !!formattedMeetup.location) {
    const addressData = formattedMeetup.location.split(' ');
    if (addressData.length > 1) {
      formattedMeetup.locationLink = `https://www.google.com/maps/place/${addressData[0]}+${addressData[1]},+Oulu+Finland`;
    } else {
      formattedMeetup.locationLink = `https://www.google.com/maps/place/${addressData[0]},+Oulu+Finland`;
    }
  }

  return formattedMeetup;
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
  if (!meetups || meetups.length === 0) {
    return null;
  }

  const currentDate = new Date();

  const futureMeetups = meetups.filter((meetup) => {
    // Make sure we're comparing dates properly
    const meetupDate = new Date(meetup.date);
    return +meetupDate >= +currentDate;
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

// Sort meetups with the closest future date first (ascending by date)
export function sortMeetupsNewestFirst(meetups: FrontMeetups) {
  return [...meetups].sort((a, b) => +a.date - +b.date);
}

// This function name is now misleading since we're sorting by closest date first,
// but we're keeping it for backward compatibility
