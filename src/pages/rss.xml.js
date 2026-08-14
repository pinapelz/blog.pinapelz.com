import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const blogPosts = await getCollection('blog');
	const microPosts = await getCollection('micro');
	const posts = [...blogPosts, ...microPosts];
	posts.sort(
		(a, b) =>
			new Date(b.data.pubDate).getTime() -
			new Date(a.data.pubDate).getTime()
	);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/${post.collection}/${post.id}/`,
		})),
	});
}
