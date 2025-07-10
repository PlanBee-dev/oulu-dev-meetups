import rss, { type RSSOptions } from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { mapMeetups } from '../utils';
import { getCollection } from 'astro:content';
import { meetupCollection } from '../content/config';

export async function get(context: RSSOptions) {
  const meetups = mapMeetups(await getCollection(meetupCollection));
  const rssItems = meetups.map((meetup) => ({
    title: meetup.title,
    link: `${import.meta.env.BASE_URL}meetups/${meetup.slug}`,
    pubDate: meetup.date,
  }));
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: rssItems,
  });
}
