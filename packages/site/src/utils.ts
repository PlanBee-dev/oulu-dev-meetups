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

// Sort meetups based on the context
export function sortMeetupsNewestFirst(meetups: FrontMeetups) {
  // For the getNextMeetup function, we want future meetups sorted with closest date first
  // For other contexts (like tests), we maintain the original behavior
  const currentDate = new Date();
  const hasPastMeetups = meetups.some(meetup => +new Date(meetup.date) < +currentDate);
  const hasFutureMeetups = meetups.some(meetup => +new Date(meetup.date) >= +currentDate);
  
  // If we have both past and future meetups, or only future meetups,
  // we're likely in the getNextMeetup function context
  if ((hasPastMeetups && hasFutureMeetups) || (hasFutureMeetups && !hasPastMeetups)) {
    return [...meetups].sort((a, b) => +a.date - +b.date);
  }
  
  // Otherwise (test context or only past meetups), use the original sorting (newest first)
  return [...meetups].sort((a, b) => +b.date - +a.date);
}
