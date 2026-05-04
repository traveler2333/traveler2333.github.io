export const site = {
  title: "Traveler2333",
  tagline: "随笔与笔记 · Essays and Notes",
  description:
    "一个关于强化学习、Agent、Python 工程化的笔记，以及人生意义、内卷之类话题的随笔。少一点结论，多一点上下文。",
  url: "https://traveler2333.github.io",
  author: {
    name: "Traveler2333",
    github: "https://github.com/traveler2333"
  },
  nav: [
    { href: "/", label: "首页" },
    { href: "/essays/", label: "随笔" },
    { href: "/notes/", label: "笔记" },
    { href: "/series/", label: "系列" },
    { href: "/about/", label: "关于" }
  ],
  social: [
    { label: "GitHub", href: "https://github.com/traveler2333" },
    { label: "RSS", href: "/rss.xml" }
  ]
} as const;

export const noteCategoryLabels: Record<string, string> = {
  RL: "强化学习",
  Agent: "Agent",
  Python: "Python",
  DL: "深度学习",
  Tooling: "工具链",
  Other: "其他"
};
