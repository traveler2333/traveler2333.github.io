#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);

const printUsage = () => {
  console.error(`Usage:
  npm run new -- essay "标题"
  npm run new -- note  "标题" --category=RL --series="PPO 实验" --order=2

选项:
  --category=<RL|Agent|Python|DL|Tooling|Other>  仅适用于 note，默认 Other
  --series=<系列名称>                               文章所属系列
  --order=<整数>                                    在系列中的顺序
  --tags=tag1,tag2                                  额外标签（逗号分隔）
  --slug=<slug>                                     自定义 slug，默认从标题生成
  --mood=<心境>                                     仅适用于 essay
`);
};

if (argv.length === 0 || argv.includes("-h") || argv.includes("--help")) {
  printUsage();
  process.exit(argv.length === 0 ? 1 : 0);
}

const flags = {};
const positional = [];
for (const a of argv) {
  if (a.startsWith("--")) {
    const eq = a.indexOf("=");
    const key = eq >= 0 ? a.slice(2, eq) : a.slice(2);
    const value = eq >= 0 ? a.slice(eq + 1) : true;
    flags[key] = value;
  } else {
    positional.push(a);
  }
}

const [type, ...titleParts] = positional;
const title = titleParts.join(" ").trim();

if (!type || (type !== "essay" && type !== "note")) {
  console.error("第一个参数必须是 'essay' 或 'note'。\n");
  printUsage();
  process.exit(1);
}

if (!title) {
  console.error("缺少标题。\n");
  printUsage();
  process.exit(1);
}

const slugify = (input) =>
  input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/_+/g, "-") || `post-${Date.now()}`;

const slug = flags.slug ? String(flags.slug) : slugify(title);

const today = new Date().toISOString().slice(0, 10);
const baseDir = path.join(process.cwd(), "src", "content", type === "essay" ? "essays" : "notes");
const file = path.join(baseDir, `${slug}.md`);

if (existsSync(file)) {
  console.error(`已存在：${file}`);
  process.exit(1);
}

const tags = (() => {
  if (typeof flags.tags === "string" && flags.tags.length > 0) {
    return flags.tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return type === "essay" ? ["随笔"] : ["学习记录"];
})();

const tagsYaml = `[${tags.map((t) => JSON.stringify(t)).join(", ")}]`;

const frontmatterLines = [
  "---",
  `title: ${JSON.stringify(title)}`,
  `description: "这里写一句文章摘要。"`,
  `date: ${today}`,
  `tags: ${tagsYaml}`
];

if (type === "note") {
  const validCategories = ["RL", "Agent", "Python", "DL", "Tooling", "Other"];
  const category =
    typeof flags.category === "string" && validCategories.includes(flags.category)
      ? flags.category
      : "Other";
  frontmatterLines.push(`category: "${category}"`);
}

if (type === "essay" && typeof flags.mood === "string" && flags.mood) {
  frontmatterLines.push(`mood: ${JSON.stringify(flags.mood)}`);
}

if (typeof flags.series === "string" && flags.series) {
  frontmatterLines.push(`series: ${JSON.stringify(flags.series)}`);
  if (typeof flags.order === "string") {
    const order = Number(flags.order);
    if (Number.isFinite(order)) frontmatterLines.push(`seriesOrder: ${order}`);
  }
}

frontmatterLines.push(`draft: false`);
frontmatterLines.push("---");

const body =
  type === "essay"
    ? `\n从这里开始写。记得：少一点结论，多一点上下文。\n`
    : `\n## 背景\n\n今天想搞清楚什么问题，为什么值得记录。\n\n## 尝试\n\n做了哪些实验，遇到了什么。\n\n## 结论\n\n哪些理解清楚了，哪些还没搞定。\n`;

await mkdir(baseDir, { recursive: true });
await writeFile(file, frontmatterLines.join("\n") + "\n" + body, "utf8");

console.log(`Created ${path.relative(process.cwd(), file)}`);
