import { Meetup } from './meetupBaseType';
import { getMeetupDate } from './meetupDate';

export function getMeetupMarkdownFileContent(meetup: Meetup) {
  return `---
title: ${meetup.title}
location: ${meetup.location}
locationLink: ${meetup.locationLink}
organizer: ${meetup.organizer}
organizerLink: ${meetup.organizerLink}
signupLink: ${meetup.signupLink}
pubDate: ${getMeetupDate(meetup.date, meetup.time).toISOString()}
---

${meetup.description}`;
}
