import { defineCollection, z } from 'astro:content';

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

const testmeetups = defineCollection({
  type: 'content',
  schema: meetupMarkdownFileMetadataSchema,
});
export const MEETUPS = 'meetups';
export const TEST_MEETUPS = 'testmeetups';

export const collections = { meetups, testmeetups };

export type CollectionName = 'meetups' | 'testmeetups';

export const getMeetupsCollectionName = () => {
  if (process.env.NODE_ENV === 'production') {
    return MEETUPS;
  } else return TEST_MEETUPS;
};
