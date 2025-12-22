import {
  type InferOutput,
  object,
  string,
  url,
  transform,
  isoTimestamp,
  pipe,
} from 'valibot';
import { type MeetupFormField } from './meetupForm';

type MeetupField = Exclude<MeetupFormField, 'time' | 'date'> & { date: Date };

export const meetupSchema = object({
  title: string(),
  description: string(),
  date: pipe(
    string(),
    isoTimestamp(),
    transform((v) => new Date(v)),
  ),
  location: string(),
  locationLink: pipe(string(), url()),
  organizer: string(),
  organizerLink: pipe(string(), url()),
  signupLink: pipe(string(), url()),
} satisfies Record<MeetupField, unknown>);

export type Meetup = InferOutput<typeof meetupSchema>;
export type MeetupWithStringDate = Omit<Meetup, 'date'> & { date: string };
