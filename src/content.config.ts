import { defineCollection } from "astro/content/config";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// see https://docs.astro.build/en/guides/content-collections/
const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    titleImages: z.array(z.string()),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    timetoreadmins: z.number(),
    date: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
  }),
});

// Below keys should match collections directory name in "src/content"
export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
};
