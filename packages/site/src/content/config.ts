import { defineCollection, z } from 'astro:content';

const meetups = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Transform string to Date object
    date: z.string(),
    location: z.string(),
    locationLink: z.string().optional(),
    organizer: z.string(),
    organizerLink: z.string().optional(),
    signupLink: z.string(),
    image: z.string().optional(),
  }),
});

const testmeetups = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Transform string to Date object
    date: z.string(),
    location: z.string(),
    locationLink: z.string().optional(),
    organizer: z.string(),
    organizerLink: z.string().optional(),
    signupLink: z.string(),
    image: z.string().optional(),
  }),
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
