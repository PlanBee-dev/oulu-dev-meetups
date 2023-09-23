import { type Meetup } from './meetupType';

export function getMeetupMarkdownFileContent(meetup: Meetup) {
  return `---
title: ${meetup.title}
location: ${meetup.location}
locationLink: ${meetup.locationLink}
organizer: ${meetup.organizer}
organizerLink: ${meetup.organizerLink}
signupLink: ${meetup.signupLink}
date: ${meetup.date.toISOString()}
---

${meetup.description}`;
}
