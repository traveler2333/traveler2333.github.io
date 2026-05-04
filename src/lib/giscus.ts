/**
 * Giscus configuration.
 *
 * To enable comments:
 * 1. Make sure the repo is public and Discussions are enabled.
 * 2. Install the giscus.app GitHub App on the repo.
 * 3. Visit https://giscus.app and run the configurator. It will give you the
 *    `repoId` and `categoryId` strings — paste them below.
 *
 * Until both IDs are filled in, post pages render a clearly-marked placeholder
 * instead of the comments iframe.
 */

export const giscus = {
  repo: "traveler2333/traveler2333.github.io",
  repoId: "R_kgDOST7skw",
  category: "Announcements",
  categoryId: "DIC_kwDOST7sk84C8USc",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "top",
  lang: "zh-CN",
  loading: "lazy"
} as const;

export const giscusEnabled = (): boolean =>
  Boolean(giscus.repoId) && Boolean(giscus.categoryId);
