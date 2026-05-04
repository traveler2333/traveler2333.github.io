import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { getAllPosts, postHref } from "../lib/posts";
import { site } from "../lib/site";

export async function GET(context: APIContext) {
  const all = await getAllPosts();
  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items: all.map((post) => {
      const kindLabel = post.kind === "essay" ? "随笔" : "笔记";
      const categories = Array.from(
        new Set([kindLabel, ...post.data.tags])
      );
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: postHref(post),
        categories
      };
    }),
    customData: `<language>zh-CN</language>`
  });
}
