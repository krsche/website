import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import icon from "astro-icon";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    react(),
    icon({
      include: {
        mdi: ["github", "linkedin"],
        tabler: ["mail", "chevron-down"],
        maki: ["arrow"],
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});