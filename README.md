# Traveler2333 Blog

一个高级感的双线博客：**随笔**（Essays）记录想法，**笔记**（Notes）记录实验。
基于 [Astro](https://astro.build) 构建，部署在 GitHub Pages。

- 主题切换（浅色 / 深色 / 跟随系统），数据持久化在 `localStorage`
- 双 Section 配色：随笔暖色 amber，笔记冷色 cyan
- 文章页：阅读进度条、目录滚动追踪（scroll-spy）、随笔首段大写首字母（drop cap）
- 系列（Series）支持：把多篇文章串成一条线，前后篇自动导航
- 标签页 + 标签云
- 站内搜索（Pagefind），任意页面 ⌘K / Ctrl+K 唤起
- 评论（Giscus，基于 GitHub Discussions），主题自动跟随站点
- 文章中可写公式（KaTeX）、Mermaid 图、双主题代码高亮
- RSS + Sitemap

## 常用命令

```bash
npm install
npm run dev              # 本地开发
npm run build            # 生产构建（含类型检查与 pagefind 索引）
npm run preview          # 预览 dist/
npm run new -- essay "标题"
npm run new -- note  "标题" --category=RL --series="PPO 实验" --order=2
npm run publish          # add . && commit && push（触发自动部署）
```

本地预览：<http://127.0.0.1:4321>

## 目录结构

```
src/
  content/
    essays/          # 随笔（Markdown / MDX）
    notes/           # 笔记（Markdown / MDX）
  components/        # Header / Footer / TOC / Comments 等
  layouts/
    BaseLayout.astro
    PostLayout.astro
  lib/
    posts.ts         # 内容查询、阅读时长、系列等
    site.ts          # 站点配置（标题、导航、社交等）
    giscus.ts        # 评论配置（需要填两个 ID）
  pages/
    index.astro
    essays/...
    notes/...
    series/...
    tags/...
    search.astro
    rss.xml.ts
    404.astro
  styles/
    index.css        # 总入口（按顺序导入）
    tokens.css       # 设计令牌
    themes.css       # 浅色 / 深色 + Shiki 双主题
    base.css         # 重置 + 基础排版
    components.css   # 头尾 / 卡片 / TOC / 进度条 / 搜索
    prose.css        # 长文排版（标题 / 列表 / 引用 / 代码 / 公式 / 表格 / 提示框）
scripts/
  new-post.mjs       # `npm run new -- essay/note "标题"`
```

## 写一篇随笔

```bash
npm run new -- essay "关于内卷的一点想法" --mood="夜里"
```

会创建 `src/content/essays/<slug>.md`，frontmatter 字段：

```yaml
title: "关于内卷的一点想法"
description: "这里写一句文章摘要。"
date: 2026-05-04
tags: ["随笔"]
mood: "夜里"
draft: false
```

可选字段：`series`、`seriesOrder`、`updated`、`cover`。

## 写一篇笔记

```bash
npm run new -- note "PPO CartPole 复现笔记" --category=RL --series="PPO 实验" --order=1
```

`category` 必须是这几个之一：`RL` / `Agent` / `Python` / `DL` / `Tooling` / `Other`。

## 公式、代码、Mermaid

行内公式：`$E = mc^2$`

块公式：

```markdown
$$
L^{CLIP}(\theta) = \mathbb{E}_t[\min(r_t \hat{A}_t, \mathrm{clip}(r_t, 1-\epsilon, 1+\epsilon)\hat{A}_t)]
$$
```

代码块：

````markdown
```python
print("hello")
```
````

Mermaid 图（页面加载时由 `mermaid` 在浏览器端渲染）：

````markdown
```mermaid
flowchart LR
  A --> B --> C
```
````

## 启用评论（Giscus）

1. GitHub 仓库 Settings → 启用 Discussions
2. 安装 [giscus.app GitHub App](https://github.com/apps/giscus)
3. 打开 <https://giscus.app>，按提示选择仓库、分类、映射方式（用 pathname）
4. 把生成的 `data-repo-id` 和 `data-category-id` 填到
   [`src/lib/giscus.ts`](src/lib/giscus.ts) 中的 `repoId` / `categoryId`

填完后所有文章页面会自动出现评论区，主题会跟随站点切换。

## 部署

仓库名建议保持 `traveler2333.github.io`。Settings → Pages → Source 选
`GitHub Actions`。推送到 `main` 后由 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
自动构建并发布到 <https://traveler2333.github.io>。
