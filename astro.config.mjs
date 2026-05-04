import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://traveler2333.github.io",
  trailingSlash: "always",
  build: {
    format: "directory"
  },
  integrations: [mdx(), sitemap(), pagefind()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false }]],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark-dimmed"
      },
      wrap: false
    }
  },
  vite: {
    ssr: {
      noExternal: ["katex"]
    }
  }
});
