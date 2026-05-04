import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const NOTE_CATEGORIES = ["RL", "Agent", "Python", "DL", "Tooling", "Other"] as const;

const essays = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/essays" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    mood: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.enum(NOTE_CATEGORIES).default("Other"),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = { essays, notes };

export type NoteCategory = (typeof NOTE_CATEGORIES)[number];
export const noteCategories: readonly NoteCategory[] = NOTE_CATEGORIES;
