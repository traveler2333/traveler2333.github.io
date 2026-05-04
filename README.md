# Traveler2333 Blog

个人博客源码。文章放在 `src/content/blog/`，使用 Markdown 编写。

## 常用命令

```bash
npm install
npm run dev
npm run new -- "PPO CartPole 实验记录"
npm run build
npm run publish
```

## 发布

仓库名建议使用 `traveler2333.github.io`。推送到 GitHub 的 `main` 分支后，GitHub Actions 会自动部署到：

```text
https://traveler2333.github.io
```

第一次使用时，在 GitHub 仓库的 Settings -> Pages 里把 Source 设为 `GitHub Actions`。
