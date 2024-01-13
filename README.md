# krsche's personal website

Built using astro and hosted on vercel.

## TODO

- Add requirements to Readme
- a nice green instead of purple
- fix exiftool pre-commit hook not adding files to stage after modification & only applying on staged / modified images
- add build step in ci to make build issues visible in gh
- add lighthouse check in ci
- improve lighthouse scores
- TIL section
- Fix ublock origin users not being counted by plausible (server side events or dynamic routing)

## NPM Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Deploy

To vercel, via vercel CLI (initially, see below).  
Vercel is set up to watch the GitHub repo and deploy everything thats on the main branch to `prod`.
`prod` here is set up to be the `me.kf-it.com` domain for now. But all this config is set in vercels project settings
through the UI.

Initially I ran:

```bash
npm install -g vercel
vercel
```

## Design notes

- Screen Width
  - Design Minimum: 320px
  - Breakpoints: 400px (xxs), 520px (xs), 640px (sm), 768px (md), 1024px (lg), 1280px (xl), 1536px (2xl)
  - Breakpoint strategy: Default design to smallest width and modify for larger screens ("mx-2 xs:mx-4")
  - Refer to: <https://tailwindcss.com/docs/responsive-design>
- Design System
  - Use [HeadlessUI](https://headlessui.com/) unstyled components whereever possible
  - Use [TailwindCSS](https://tailwindcss.com/) instead of raw CSS for styling whereever possible
  - Design in black/white first, add color later
  - Avoid client-side javascript as much as possible
