import { getCollection, type CollectionEntry } from "astro:content";
import readingTime from "reading-time";

export type EssayEntry = CollectionEntry<"essays">;
export type NoteEntry = CollectionEntry<"notes">;
export type AnyPost =
  | (EssayEntry & { kind: "essay" })
  | (NoteEntry & { kind: "note" });

const isPublished = (entry: { data: { draft?: boolean } }) =>
  !entry.data.draft || import.meta.env.DEV;

export async function getEssays(): Promise<EssayEntry[]> {
  const all = await getCollection("essays");
  return all
    .filter(isPublished)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getNotes(): Promise<NoteEntry[]> {
  const all = await getCollection("notes");
  return all
    .filter(isPublished)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getAllPosts(): Promise<AnyPost[]> {
  const [essays, notes] = await Promise.all([getEssays(), getNotes()]);
  const tagged: AnyPost[] = [
    ...essays.map((entry) => ({ ...entry, kind: "essay" as const })),
    ...notes.map((entry) => ({ ...entry, kind: "note" as const }))
  ];
  return tagged.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function postHref(post: AnyPost): string {
  return post.kind === "essay" ? `/essays/${post.id}/` : `/notes/${post.id}/`;
}

export function entryHref(
  kind: "essay" | "note",
  id: string
): string {
  return kind === "essay" ? `/essays/${id}/` : `/notes/${id}/`;
}

export function getReadingTime(body: string | undefined): {
  minutes: number;
  words: number;
  text: string;
} {
  const source = body ?? "";
  const stats = readingTime(source);
  // The default reading-time package counts whitespace-separated words which
  // under-counts CJK. Add a CJK character count divided by 320 chars/min as
  // a heuristic so Chinese articles get a sensible estimate.
  const cjkChars = (source.match(/[\u3400-\u9fff]/g) || []).length;
  const cjkMinutes = cjkChars / 320;
  const minutes = Math.max(1, Math.round(stats.minutes + cjkMinutes));
  const words = stats.words + cjkChars;
  return { minutes, words, text: `${minutes} 分钟阅读` };
}

export function formatDate(date: Date, dateStyle: "long" | "medium" = "medium") {
  return new Intl.DateTimeFormat("zh-CN", { dateStyle }).format(date);
}

export function groupByYear<T extends { data: { date: Date } }>(items: T[]) {
  const buckets = new Map<number, T[]>();
  for (const item of items) {
    const year = item.data.date.getFullYear();
    const list = buckets.get(year) ?? [];
    list.push(item);
    buckets.set(year, list);
  }
  return Array.from(buckets.entries()).sort((a, b) => b[0] - a[0]);
}

export function collectTags(posts: AnyPost[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function tagHref(tag: string) {
  return `/tags/${encodeURIComponent(tag)}/`;
}

export function seriesHref(name: string) {
  return `/series/${encodeURIComponent(name)}/`;
}

export function getSeries(posts: AnyPost[]) {
  const map = new Map<string, AnyPost[]>();
  for (const post of posts) {
    const name = post.data.series;
    if (!name) continue;
    const list = map.get(name) ?? [];
    list.push(post);
    map.set(name, list);
  }
  for (const list of map.values()) {
    list.sort(
      (a, b) =>
        (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0) ||
        a.data.date.valueOf() - b.data.date.valueOf()
    );
  }
  return map;
}

export function getSeriesNeighbors(
  posts: AnyPost[],
  current: { kind: "essay" | "note"; id: string; series?: string }
) {
  if (!current.series) return { prev: undefined, next: undefined };
  const seriesPosts =
    getSeries(posts).get(current.series) ?? [];
  const idx = seriesPosts.findIndex(
    (p) => p.kind === current.kind && p.id === current.id
  );
  return {
    prev: idx > 0 ? seriesPosts[idx - 1] : undefined,
    next: idx >= 0 && idx < seriesPosts.length - 1 ? seriesPosts[idx + 1] : undefined,
    seriesPosts
  };
}
