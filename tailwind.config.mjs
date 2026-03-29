/** @type {import('tailwindcss').Config} */
// Typography is loaded via `@plugin "@tailwindcss/typography"` in src/styles/global.css (Tailwind v4).

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
    screens: {
      // only use px here
      xxs: "400px",
      xs: "520px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
};
