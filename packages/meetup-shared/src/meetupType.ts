import {
  type Output,
  object,
  string,
  url,
  transform,
  isoTimestamp,
} from 'valibot';
import { type MeetupFormField } from './meetupForm';

type MeetupField = Exclude<MeetupFormField, 'time' | 'date'> & { date: Date };

export const meetupSchema = object({
  title: string(),
  description: string(),
  date: transform(string([isoTimestamp()]), (v) => new Date(v)),
  location: string(),
  locationLink: string([url()]),
  organizer: string(),
  organizerLink: string([url()]),
  signupLink: string([url()]),
} satisfies Record<MeetupField, unknown>);

export type Meetup = Output<typeof meetupSchema>;
export type MeetupWithStringDate = Omit<Meetup, 'date'> & { date: string };
