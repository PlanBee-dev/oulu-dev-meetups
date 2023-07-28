import { z } from 'zod';

export const meetupSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  locationLink: z.string(),
  organizer: z.string(),
  organizerLink: z.string(),
  signupLink: z.string(),
});

export type Meetup = z.infer<typeof meetupSchema>;
export type MeetupKey = keyof Meetup;

export const meetupTitles = [
  'Meetup title',
  'Description',
  'Date',
  'Time',
  'Street address',
  'Maps link for address',
  'Organizer',
  'Organizer link',
  'Signup link for meetup',
] as const;

export type MeetupTitle = (typeof meetupTitles)[number];

export const meetupKeyMap: Record<MeetupKey, MeetupTitle> = {
  title: 'Meetup title',
  description: 'Description',
  date: 'Date',
  time: 'Time',
  location: 'Street address',
  locationLink: 'Maps link for address',
  organizer: 'Organizer',
  organizerLink: 'Organizer link',
  signupLink: 'Signup link for meetup',
} as const;
