# Two Sisters, One Stone

*Follow the bloodline. Find your way home.*

A story-driven escape room based on Yaa Gyasi's *Homegoing*. AAAD 130 Final Project, Group 3.

Static site, no backend or build step: `index.html`, `css/`, `js/`.

## Run locally

```
python -m http.server 5173
```

Then open http://localhost:5173.

## Editing room content

- Room text, cards and hints live in `js/rooms.js`.
- Answers are stored as SHA-256 hashes, never in plain text. To make one:
  `node tools/hash.js "tsos-r1|c1|D"` and paste the output into `rooms.js`.

## Status

| Room | Status |
|---|---|
| 1. The Castle | Playable |
| 2. The Family Tree | Not built |
| 3. The Mines | Not built |
| 4. Homecoming | Not built |

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo, framework preset **Other**, no build command.
3. **Settings → Domains**, add the subdomain, then add the CNAME record Vercel shows at your DNS provider.
