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

All four rooms and the ending screen are playable. See `ANSWER_KEY.md` for answers, page
citations and the team review checklist.

Rooms get gradually harder (professor's feedback):

| Room | Level | Puzzle |
|---|---|---|
| 1. The Castle | Warm-up | Sort 8 memories: Effia upstairs or Esi in the dungeon |
| 2. The Family Tree | Moderate | Place 12 descendants in 7 generations, each with a story clue |
| 3. The Mines | Challenging | Fill 5 blanks in H's prisoner record |
| 4. Homecoming | Finale | Mark 6 moments as fire or water, then type Marjorie's last words |

Story text and "Why this matters" notes are in `index.html`; puzzle data and hints are in `js/rooms.js`.

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo, framework preset **Other**, no build command.
3. **Settings → Domains**, add the subdomain, then add the CNAME record Vercel shows at your DNS provider.
