import { type Output, date, object, string, url } from 'valibot';

export const meetupSchema = object({
  title: string(),
  description: string(),
  date: date(),
  location: string(),
  locationLink: string([url()]),
  organizer: string(),
  organizerLink: string([url()]),
  signupLink: string([url()]),
});

export type Meetup = Output<typeof meetupSchema>;
