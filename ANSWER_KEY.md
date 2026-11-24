# Answer Key and Review Guide

For Group 3 only. This file is excluded from the live site (`.vercelignore`).

Page numbers are the printed pages of *Homegoing* (our PDF copy's page number minus 18).
Puzzle answers and hints are in `js/rooms.js`. Story text and "Why this matters" notes are in `index.html`.

**To review your room:** play it at https://game.8022029.xyz, check every line against the pages below, and send fixes to Saaketh (or edit the files directly). If an answer changes, its hash must be regenerated with `node tools/hash.js`.

---

## Difficulty curve

Added after the professor's feedback: the rooms should get gradually harder, without getting niche.

| Room | Level | What it asks of players |
|---|---|---|
| 1. The Castle | Warm-up | 8 major plot moments, two choices each |
| 2. The Family Tree | Moderate | Put 12 people in order, using a story clue on each name |
| 3. The Mines | Challenging | 5 blanks mixing the novel with course knowledge (13th Amendment, convict leasing) |
| 4. Homecoming | Finale | Recall fire or water moments from across all seven generations, then type the book's last words |

---

## Room 1: The Castle

Sort 8 memories into Upstairs (Effia) or The Dungeon (Esi).

| Upstairs (Effia) | Dungeon (Esi) |
|---|---|
| Married to James Collins, the governor (pp. 14, 16) | Daughter of Big Man, the best warrior in an Asante village (pp. 28, 31) |
| Believes Baaba is her mother (p. 27) | Fifteenth birthday in the women's dungeon (p. 28) |
| Handed a black stone, "a piece of your mother" (p. 16) | Her mother chooses Abronoma from war prisoners (p. 35) |
| Gives birth to Quey (pp. 25, 50) | Forced out before she can dig up her mother's stone (p. 49) |

## Room 2: The Family Tree

Place 12 descendants (Effia and Esi are pre-filled). No decoys. Each name shows a one-line clue:

| Name | Clue | Page |
|---|---|---|
| Quey | Son of Effia and the British governor | 50 |
| Ness | Enslaved on a plantation in Alabama | 70 |
| James | Fakes his own death in a war to live as a simple farmer | 102, 109 |
| Kojo | Known as Jo, lives free in Baltimore and works on the ships | 111 |
| Abena | Daughter of the man everyone calls "Unlucky" | 133 |
| H | Sold to work the coal mines outside Birmingham | 159 |
| Akua | Raised by missionaries, haunted by dreams of a "firewoman" | 177 |
| Willie | A gifted singer who moves north to Harlem | 200–201 |
| Yaw | A history teacher with a scar on his face | 224–227 |
| Sonny | Grows up in Harlem and struggles with drug addiction | 247, 255 |
| Marjorie | Grows up between Ghana and Huntsville, Alabama | 266 |
| Marcus | A Stanford PhD student researching his family's past | 286, 289 |

Source for the tree: the family tree printed before chapter one, and the chapter order.

| Gen | Effia's line | Esi's line |
|---|---|---|
| 1 | Effia | Esi |
| 2 | Quey | Ness |
| 3 | James | Kojo |
| 4 | Abena | H |
| 5 | Akua | Willie |
| 6 | Yaw | Sonny |
| 7 | Marjorie | Marcus |

"Why this matters" facts: Ness on an Alabama plantation (p. 70), Kojo free in Baltimore as the Fugitive Slave Act passes (pp. 112, 123), H in the coal mines (p. 159), Willie in Harlem (p. 200), Akua's missionary school (p. 177), Yaw as a history teacher (pp. 222–224).

## Room 3: The Mines

Five dropdown blanks in H's prisoner record. The year (1880, p. 159) is now given in the text, not asked.

| Blank | Answer | Source |
|---|---|---|
| Accused of | looking at a white woman | p. 158 ("studyin a white woman") |
| Mines | coal | p. 159 |
| 13th Amendment exception | crime | course concept (the "punishment for crime" clause) |
| System | convict leasing | course concept; Marcus's research, p. 289 |
| Great-grandson | Marcus | p. 289 |

Closing quote: "War may be over but it ain't ended." H's cellmate, p. 158.

## Room 4: Homecoming

**Step 1: fire or water?** Effia's line is fire, Esi's line is water. Three of the six moments don't name their element.

| Moment | Answer | Page |
|---|---|---|
| The night Effia is born, something tears through the woods... | Fire | 3 |
| Esi is marched toward the ships beyond the Door of No Return | Water | 49 |
| Kojo works the ships of Baltimore's harbor | Water | 111 |
| Akua becomes "the Crazy Woman" after losing two daughters | Fire (she set the hut on fire in her sleep) | 197, 227 |
| Yaw's students trade rumors about his scar | Fire (burned as a baby in that fire) | 225–227 |
| Marcus is scared of drowning | Water | 296 |

**Step 2:** Marjorie's words: **"Welcome home."** (p. 300). Capitalization, spaces and punctuation are ignored.
- Setting: the Cape Coast Castle tour, women's dungeon and Door of No Return (pp. 298–299); fire at the water's edge on the beach (pp. 299–300).

---

## Still to do

- [ ] Each room owner reviews their room against the book
- [ ] Add the specific lecture or reading each "Why this matters" note connects to
- [ ] Playtest with someone outside the group and time it (target 12 to 15 minutes)
