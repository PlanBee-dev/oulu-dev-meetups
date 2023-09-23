import rss, { RSSOptions } from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getMeetups } from '../get-meetups';

export async function get(context: RSSOptions) {
  const meetups = await getMeetups();
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
