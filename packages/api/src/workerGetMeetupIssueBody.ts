import { tz } from '@date-fns/tz';
import { format } from 'date-fns';
import { type Meetup } from 'meetup-shared';

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

const EuropeHelsinki = tz('Europe/Helsinki');
function extractDateAndTime(date: Date) {
  return {
    date: format(date, 'yyyy-MM-dd', { in: EuropeHelsinki }),
    time: format(date, 'HH:mm', { in: EuropeHelsinki }),
  };
}
