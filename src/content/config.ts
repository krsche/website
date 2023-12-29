import { z, defineCollection } from "astro:content";

// see https://docs.astro.build/en/guides/content-collections/#defining-collections
const projectsCollection = defineCollection({
  type: "content", // 'content' for markdown, 'data' for json/yaml
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    titleImages: z.array(z.string()),
  }),
});

const blogCollection = defineCollection({
  type: "content", // 'content' for markdown, 'data' for json/yaml
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
