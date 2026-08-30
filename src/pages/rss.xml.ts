import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (
    await getCollection("post", ({ data }) => !data.draft && !data.hide)
  ).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "caffeinate",
    description: "the blog and website of Nate Barbettini",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/post/${post.id}/`,
      description: post.data.description,
    })),
  });
}
