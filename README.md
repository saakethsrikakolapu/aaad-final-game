# Two Sisters, One Stone

*Follow the bloodline. Find your way home.*

**Play it: [game.8022029.xyz](https://game.8022029.xyz)**

A story-driven online escape room based on Yaa Gyasi's *Homegoing*. Players follow the two lines of the family, Effia's and Esi's, across seven generations. They solve four rooms to rebuild the black stone that the two sisters inherited from their mother.

Made by Group 3 for the AAAD 130 final project at UNC-Chapel Hill (Fall 2026): Saaketh, Sohan, Abhi, Sawyer and Abdullah.

## How to play

- Play as a team of 2 to 5 at one screen. It takes about 12 to 15 minutes.
- Every answer comes from *Homegoing*, so you don't need any outside knowledge.
- Each room has 3 hints, which the ending screen counts.
- Progress saves in your browser, and **Restart** starts the game over.

## Rooms

The rooms get gradually harder.

| Room | Level | Puzzle |
|---|---|---|
| 1. The Castle | Warm-up | Sort 8 memories by sister: Effia upstairs, or Esi in the dungeon |
| 2. The Family Tree | Moderate | Drag or tap 12 descendants into 7 generations, using a story clue on each name |
| 3. The Mines | Challenging | Fill 6 blanks in H's prisoner record. Every wrong choice is a trap from the book |
| 4. Homecoming | Finale | Mark 6 moments as fire or water, then type Marjorie's last words |

After each room, a "Why this matters" note connects the puzzle back to the book.

## Built with

- Plain HTML, CSS and JavaScript, with no framework, build step or backend.
- Answers are stored only as SHA-256 hashes, so they can't be read from the page source.
- Hosted on Vercel, which redeploys on every push to `main`.

## Project structure

```
index.html      All screens: title, how to play, map, the 4 rooms, ending
css/style.css   Theme (fire and water colors, wave and flame bands, paper texture)
js/rooms.js     Puzzle data, answer hashes and hints for each room
js/game.js      Game logic: screens, saving progress, drag and drop, checking answers
tools/hash.js   Makes an answer hash
```

These files are for the team only and are kept off the live site by `.vercelignore`: `ANSWER_KEY.md` (answers with page citations), `CANVAS_POST.md`, `README.md` and `tools/`.

## Run locally

```
python -m http.server 5173
```

Then open http://localhost:5173.

## Editing room content

- Story text and the "Why this matters" notes are in `index.html`. Puzzle data and hints are in `js/rooms.js`.
- If you change an answer, make a new hash and paste it into `rooms.js`:
  ```
  node tools/hash.js "tsos-r1|c1|D"
  ```
  The format is `<salt><id>|<answer>`.
- Update `ANSWER_KEY.md` with the new answer and its page number.

## Deploy

Pushing to `main` deploys to [game.8022029.xyz](https://game.8022029.xyz) automatically. After a deploy, check that `/ANSWER_KEY.md` returns a 404 on the live site.

---

*Homegoing* © Yaa Gyasi (Knopf, 2016). This is a student project made for a class.
