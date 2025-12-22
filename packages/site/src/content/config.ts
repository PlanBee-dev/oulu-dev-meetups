import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';

const meetupMarkdownFileMetadataSchema = z.object({
  title: z.string(),
  date: z.string().transform((date) => new Date(date)),
  location: z.string(),
  locationLink: z.string().optional(),
  organizer: z.string(),
  organizerLink: z.string().optional(),
  signupLink: z.string(),
  image: z.string().optional(),
});

const meetups = defineCollection({
  type: 'content',
  schema: meetupMarkdownFileMetadataSchema,
});

export const collections = { meetups, testmeetups: meetups };

export type CollectionName = keyof typeof collections;

export const meetupCollection: CollectionName =
  process.env.NODE_ENV === 'production' ? 'meetups' : 'testmeetups';
