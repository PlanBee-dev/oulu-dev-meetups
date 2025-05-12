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

  // Get the current date and time
  const currentDate = new Date();

  // Filter to only include future meetups
  const futureMeetups = meetups.filter((meetup) => {
    // Ensure we're working with Date objects
    const meetupDate = meetup.date instanceof Date ? meetup.date : new Date(meetup.date);
    
    // Compare timestamps (includes both date and time)
    return +meetupDate >= +currentDate;
  });

  if (futureMeetups.length === 0) return null;

  // Sort future meetups by date (ascending) to get the closest upcoming meetup first
  // Create a new array to avoid mutating the original
  const sorted = [...futureMeetups].sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    return +dateA - +dateB;
  });

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

// Sort meetups with newest first (descending by date)
export function sortMeetupsNewestFirst(meetups: FrontMeetups) {
  return [...meetups].sort((a, b) => +b.date - +a.date);
}
