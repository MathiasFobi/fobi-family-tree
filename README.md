# The Fobi Family Tree 🌳

A living family tree website honoring the descendants of **Vincent & Barbara Fobi**.

Built to:
- 🌹 **Honor those who have passed** — dignified memorials with RIP markers
- 🌱 **Keep the living connected** — every family member has a profile page

## What's here

- **Hero** with the ancestors' names and a family lineage tagline
- **Stats** — total family members, by generation, plus a "Remembered" count
- **Founding Ancestors** card
- **The Tree** — three generation cards (Children / Grandchildren / Great-Grandchildren)
- **In Memoriam** — dedicated section for those who have passed
- **Person profile pages** at `/tree/[id]` — bio, parents, children, and a "Contribute a story" call

## Data

All family data lives in `data/family.json`, generated from `Vincent_and_Barbara_Fobi_Descendants.xlsx` via the included Python conversion script (see `scripts/import-xlsx.py` — to be added when needed). To update the tree:

1. Edit the spreadsheet
2. Re-run the import script to regenerate `data/family.json`
3. Commit + push → auto-deploys

## Tech

- Next.js 15 (App Router), TypeScript, plain CSS (no framework)
- Static site — all 194+ person pages prerendered, build is ~111 KB First Load JS
- All photos will be added with family permission

## Develop

```bash
npm install
npm run dev    # http://localhost:3000
```

## Deploy to Vercel

This project is configured to deploy via the Vercel CLI. From the project root:

```bash
vercel deploy --prod
```

GitHub: `MathiasFobi/fobi-family-tree` · Live: `https://fobi-family-tree.vercel.app`
