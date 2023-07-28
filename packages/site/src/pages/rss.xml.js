import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function get(context) {
  const meetups = await getCollection('meetups');
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: meetups.map((meetup) => ({
      ...meetup.data,
      link: `/meetups/${meetup.slug}/`,
    })),
  });
}
