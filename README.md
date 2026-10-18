# Text Transpose

A small web page that transposes text.

- **Columns to rows** (default): transposes a whole table, so columns become rows. The separator is auto-detected (tab, comma, semicolon, pipe) or chosen by hand, and short rows are padded with empty cells. A list with one item per line, and no separator, comes out as a single tab-separated row.
- **Lines to one row**: every line becomes one cell of a single row and is never split further, which keeps spaces inside items. This is what the original version of the page did (newlines replaced by tabs).

The transpose logic lives in `lib/transpose.ts`; the page is `app/page.tsx`.

## Development

```bash
npm install
npm run dev
```

Open <http://localhost:3000/text-transpose>. The app is exported as a static site with the base path `/text-transpose`.

## Deployment

The site is a static export (`output: "export"`), so any static host works.

**GitHub Pages (default).** Pushes to `main` run `.github/workflows/deploy.yml`, which builds the site and publishes the `out` folder. In the repository settings, set **Pages → Source** to **GitHub Actions** once. The site is then served at `https://obakefilter.github.io/text-transpose/`.

**Root deployments (Vercel, Netlify, a custom domain).** Build with an empty base path:

```bash
NEXT_PUBLIC_BASE_PATH="" npm run build
```

and serve the `out` folder.

**Manual publish to the `gh-pages` branch.** `npm run deploy` still works and uses the same base path. `public/.nojekyll` is included so GitHub Pages serves the `_next` folder.
