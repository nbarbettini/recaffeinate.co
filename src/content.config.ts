import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const post = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/post" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    canonical: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    series: z
      .union([
        // Legacy series metadata retained for older imported posts.
        z.array(z.string()),
        z.object({
          name: z.string(),
          order: z.number().int().nonnegative(),
        }),
      ])
      .optional(),
    draft: z.boolean().optional().default(false),
    postimage: z.string().optional(),
    previewimage: z.string().optional(),
    previewimagealt: z.string().optional(),
    banner: z.string().optional(),
    hide: z.boolean().optional().default(false),
    page: z.boolean().optional().default(false),
  }),
});

export const collections = { post };
