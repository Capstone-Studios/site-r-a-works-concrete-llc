# Capstone Site Template

Premium one-pager template for trades business websites. Used by Capstone Studios CRM to generate standalone sites per client.

## How It Works

1. **Data lives in `data/site.json`** — all business info, copy, reviews, design tokens
2. **`components/site-renderer.tsx`** reads that JSON and renders the site
3. **One route** (`app/page.tsx`) — no bloat, fast builds
4. **Deploy on push** — Vercel auto-deploys any changes to `data/site.json`

## Per-Client Usage

The Capstone Studios CRM creates a copy of this repo for each client using the GitHub API, then writes their personalized `data/site.json`. Each client gets:
- Their own GitHub repo (e.g. `site-bobs-roofing-abc123`)
- Their own Vercel project
- Their own `.vercel.app` URL (or custom domain later)

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the template with placeholder data.

## Editing the Template Design

Changes to `components/site-renderer.tsx` only affect the template repo. Existing client sites that were already cloned won't auto-update unless you push changes to each client repo (or use the CRM to regenerate).

## Structure

```
capstone-site-template/
├── app/
│   ├── layout.tsx       # Root layout, reads SEO from site.json
│   ├── page.tsx         # Single page, renders SiteRenderer
│   └── globals.css      # Premium styling (dark theme, noise texture)
├── components/
│   └── site-renderer.tsx  # The whole site as one component
├── data/
│   └── site.json        # Business data (swapped per client)
└── ...config files
```
