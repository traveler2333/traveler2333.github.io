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

本地预览地址通常是：

```text
http://127.0.0.1:4321
```

新文章会创建在 `src/content/blog/`。打开生成的 Markdown 文件，把 `description`、`tags` 和正文改掉即可。

## 发布

仓库名建议使用 `traveler2333.github.io`。推送到 GitHub 的 `main` 分支后，GitHub Actions 会自动部署到：

```text
https://traveler2333.github.io
```

第一次使用时，在 GitHub 仓库的 Settings -> Pages 里把 Source 设为 `GitHub Actions`。

如果远端仓库还没有创建，先在 GitHub 新建一个空仓库：

```text
traveler2333.github.io
```

不要勾选初始化 README、`.gitignore` 或 License。创建后回到本目录执行：

```bash
git push -u origin main
```

以后写完文章执行：

```bash
npm run build
npm run publish
```
