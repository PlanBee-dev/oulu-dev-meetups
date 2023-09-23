import { getCollection } from 'astro:content';
import { getMeetupsCollectionName } from './content/config';
import { createShortDescription } from './utils';
import { format } from 'date-fns';

export async function getMeetups() {
  const meetups = await getCollection(getMeetupsCollectionName());

  return meetups.map((meetup) => {
    const {
      data: { date, ...restData },
      slug,
      body,
      render,
    } = meetup;

    const dateObj = new Date(date);

    return {
      render,
      slug: slug as string,
      body,
      shortDescription: createShortDescription(body),
      formattedDate: format(dateObj, 'dd.MM.yyyy HH:mm'),
      date: dateObj,
      ...restData,
    };
  });
}

export type FrontMeetups = Awaited<ReturnType<typeof getMeetups>>;
export type FrontMeetup = FrontMeetups[number];
