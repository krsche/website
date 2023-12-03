import { z, defineCollection } from "astro:content";

// see https://docs.astro.build/en/guides/content-collections/#defining-collections
const projectsCollection = defineCollection({
  type: "content", // 'content' for markdown, 'data' for json/yaml
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

// Below keys should match collections directory name in "src/content"
export const collections = {
  projects: projectsCollection,
};
