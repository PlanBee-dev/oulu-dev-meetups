import { format } from 'date-fns';
import { safeParseAsync } from 'valibot';
import { meetupFormValuesSchema } from './meetupForm';
import { type Meetup } from './meetupType';

export function getMeetupIssueBody(meetup: Meetup) {
  const { date, time } = extractDateAndTime(meetup.date);

  return `
### Meetup title

${meetup.title}

### Date

${date}

### Time

${time}

### Street address

${meetup.location}

### Maps link for address

${meetup.locationLink}

### Organizer

${meetup.organizer}

### Organizer link

${meetup.organizerLink}

### Signup link for meetup

${meetup.signupLink}

### Description

${meetup.description}`;
}

export function parseMeetupIssueBody(body: string) {
  const unverifiedMeetupFormValues = {
    title: getValueFromBody(body, 'Meetup title'),
    date: getValueFromBody(body, 'Date'),
    time: getValueFromBody(body, 'Time'),
    location: getValueFromBody(body, 'Street address'),
    locationLink: addHttpsIfMissing(
      getValueFromBody(body, 'Maps link for address'),
    ),
    organizer: getValueFromBody(body, 'Organizer'),
    organizerLink: addHttpsIfMissing(getValueFromBody(body, 'Organizer link')),
    signupLink: addHttpsIfMissing(
      getValueFromBody(body, 'Signup link for meetup'),
    ),
    description: getRestAfterTitle(body, 'Description'),
  };

  return safeParseAsync(meetupFormValuesSchema, unverifiedMeetupFormValues);
}

function extractDateAndTime(date: Date) {
  return {
    date: format(date, 'yyyy-MM-dd'),
    time: format(date, 'HH:mm'),
  };
}

function getValueFromBody(body: string, title: string) {
  const regex = new RegExp(`### ${title}\\s*\\n\\s*([\\s\\S]*?)\\s*\\n\\s*###`);
  const match = body.match(regex);

  if (match) {
    return match[1];
  }

  return null;
}

function getRestAfterTitle(body: string, title: string) {
  const regex = new RegExp(`### ${title}\\s*\\n\\s*([\\s\\S]*)`);
  const match = body.match(regex);

  if (match) {
    return match[1];
  }

  return null;
}

function addHttpsIfMissing(url: string | null) {
  if (url && !url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
}
