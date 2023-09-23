import {
  type Output,
  object,
  string,
  url,
  transform,
  isoTimestamp,
} from 'valibot';

export const meetupSchema = object({
  title: string(),
  description: string(),
  date: transform(string([isoTimestamp()]), (v) => new Date(v)),
  location: string(),
  locationLink: string([url()]),
  organizer: string(),
  organizerLink: string([url()]),
  signupLink: string([url()]),
});

export type Meetup = Output<typeof meetupSchema>;
export type MeetupWithStringDate = Omit<Meetup, 'date'> & { date: string };
