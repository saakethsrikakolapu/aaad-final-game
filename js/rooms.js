/* Puzzle data and hints for each room. Story text and "Why this matters" notes live in index.html.
   Answers are never stored in plain text: each one is the SHA-256 hash of "<salt><id>|<answer>".
   To make a new hash: node tools/hash.js "tsos-r1|c1|D"
   Page numbers are the printed Homegoing pages (PDF page minus 18 in our copy). */

window.ROOMS = [
  { id: 1, name: "The Castle",      era: "Cape Coast Castle · 1760s",          screen: "room1" },
  { id: 2, name: "The Family Tree", era: "Seven generations · two continents", screen: "room2" },
  { id: 3, name: "The Mines",       era: "Birmingham, Alabama · 1880",         screen: "room3" },
  { id: 4, name: "Homecoming",      era: "Cape Coast, Ghana · present day",    screen: "room4" }
];

/* ---------- Room 1: sort memories into Upstairs (U) or Dungeon (D) ---------- */
window.ROOM1 = {
  salt: "tsos-r1|",
  cards: [
    { id: "c1", text: "Is the daughter of Big Man, the best warrior in an Asante village.", // p. 28, 31
      hash: "a5335e59aaddb896addf6070803b93fe391bf9eed5808f70994f99ca2ba37da6" },
    { id: "c2", text: "Is married to James Collins, the British governor of Cape Coast Castle.", // p. 14, 16
      hash: "fbb37be54265c33715b6a21324506fccd1c85a2bb8968e32c5fcaee1731712f9" },
    { id: "c3", text: "Spends her fifteenth birthday in the women's dungeon, surrounded by hundreds of captive women.", // p. 28
      hash: "19d8cd912848e36b222ae1c39b448e4b2a62283dd203997f71b546ca43b24f75" },
    { id: "c4", text: "Grows up believing that Baaba is her mother.", // p. 27 (Fiifi tells her the truth)
      hash: "70207f2d58127a166c1a0bc422666ffd839d1f739b8e41e415b7fd809df2126d" },
    { id: "c5", text: "Is handed a black stone, \"a piece of your mother,\" once her marriage to a white man is arranged.", // p. 16
      hash: "0a8c6944ae82d89fd9c447e10a1fef932e185df28f888c94e6b849e015c436be" },
    { id: "c6", text: "Her mother is pushed to choose a house girl, Abronoma, from the war prisoners paraded through their village.", // p. 35
      hash: "0f058e9d7c5c8370f99918727f8414790f0cdc455fe5c6f06ddc4782f5338b58" },
    { id: "c7", text: "Gives birth to a son named Quey.", // p. 25 (pregnancy), p. 50
      hash: "4b9a48ce88fb5e4c8903d310663e4cfbe681bba74e7bed78a04e2406b99e7a63" },
    { id: "c8", text: "Is forced out of the dungeon before she can dig up her mother's stone.", // p. 49
      hash: "95e1b7a6ee7caea2285e13b38344e185cd78ea57d035444f6cf2df2574ff897d" }
  ],
  hints: [
    "Two sisters, one building. One has a home inside the castle. The other is held captive beneath it.",
    "Effia grows up in Fanteland and is married off to a British official. Esi grows up in Asanteland and is captured in a raid.",
    "Both sisters carry a black stone from Maame, but only one of them knew Maame as her mother growing up."
  ]
};

/* ---------- Room 2: place each descendant in the right generation ----------
   Slots: F = Effia's line, W = Esi's line (water), number = generation. Generation 1 is pre-filled.
   Source: the family tree printed before chapter one, and the chapter order. */
window.ROOM2 = {
  salt: "tsos-r2|",
  // Shown in the name bank in this order. Fiifi (Effia's brother) and Anna (Kojo's wife) are decoys.
  names: ["Willie", "Akua", "Fiifi", "Ness", "Marjorie", "Quey", "Sonny", "Abena",
          "Kojo", "Anna", "Yaw", "H", "James", "Marcus"],
  slots: {
    F2: "385e05cb9372c5a0a82c2410ef3b7945d7179c8adb5ceaeb55b217cc42cfa34a",
    F3: "4ac82ebad04c74dbf20114682ac1c907c1d461560ef7c95209ed62d37c7ce590",
    F4: "77be97a30fe8909e51f77741b8ccd51adc922b6d7614ce246f9b77b2074ad7e5",
    F5: "be089eed4a3940e3263db62e1720dcfa549a498dc60f27bf2c24453ebf87613c",
    F6: "2298b1a45871bfcbdeb8b90843916077925db90094de9bb075cea35919fcb601",
    F7: "2833f06973ee502130171a6ef3a7d47a9143eaf97804b3ce271d17999f197c27",
    W2: "85e524fedb169928ed15bd8e337bdcafcdf5cc83dcfadf5472e0b87ca55a4a36",
    W3: "80278bb849a7550b8d47baada2446c5604313d7535b99abfd502c2a3fe0fc117",
    W4: "ea8568511ff28f41064a5c3129f406df1bf2d272dd745871ba26318d26f33b34",
    W5: "df9ab7ff172898c8c61d6d3a498f6c17bd3c20be1853d71ad01f85e3c02bea51",
    W6: "81e826df087716f9b0ce3ac79e846de61b4d25e6b12e81acc5f1dbc00976f73d",
    W7: "d633b35d2781324b41cdacf4e5ccc5fd1e45e23eabf6c4be32e0e2398efd4ee0"
  },
  hints: [
    "Each generation gets one chapter, and the chapters alternate between the two families in order.",
    "Two names in the bank are not descendants. Fiifi is Effia's brother, and Anna is Kojo's wife.",
    "H is Kojo's son, and Willie is H's daughter. On Effia's side, Akua is Abena's daughter, and Yaw is Akua's son."
  ]
};

/* ---------- Room 3: complete H's record (dropdowns) ---------- */
window.ROOM3 = {
  salt: "tsos-r3|",
  fields: {
    f1: { options: ["1865", "1880", "1910", "1955"],                                  // p. 159
          hash: "265a01c3015afe50b3fc17b8f9779863c54f61511bea600808d68f79fd813582" },
    f2: { options: ["stealing a horse", "looking at a white woman", "skipping a debt payment", "fighting a deputy"], // p. 158
          hash: "3aad3a1197af5da026643de0dabdda3a0f61b253da37bb31ca2d319e7ad2c57f" },
    f3: { options: ["gold", "iron", "coal", "salt"],                                   // p. 159
          hash: "fa6728fad574cae20278ffa368b77931df664ead5a3a849d392626d4ab4d618c" },
    f4: { options: ["sharecropping", "convict leasing", "indentured servitude", "the Great Migration"],
          hash: "6ce97b004ffd45ddb54d2c1357c5e8ef80c8aa76ea67b7bad51e6f2ec214bc46" },
    f5: { options: ["Willie", "Sonny", "Yaw", "Marcus"],                               // p. 289
          hash: "885d3787bef828f9957fd18ee7ce6160cdf2b73c806d89f800c9e23a333a62cf" }
  },
  hints: [
    "H was born into slavery and was about thirteen when the Civil War ended. His arrest comes about fifteen years later.",
    "The police didn't need proof. A cellmate tells H all they had to do was say he'd been eyeing someone.",
    "Birmingham was built on what came out of the ground there. The descendant who studies H's story is a PhD student at Stanford."
  ]
};

/* ---------- Room 4: two steps — the fears, then Marjorie's last words ---------- */
window.ROOM4 = {
  salt: "tsos-r4|",
  fears: {                                                                            // p. 294, 296
    marjorie: "b6d25a7016ab3b8a1303fa3ef36ff43f25fd2243a6e4276bcbe70aa52e7e96cf",
    marcus:   "b7d3eb76f1ef36d2574f2b55734dbe694d50f3abc91f9b2f803a44ae6e0ead82"
  },
  // Typed answer is uppercased with everything except letters removed before hashing.
  words: "c6422c9b597b84003a566039bdf3c972195ecf70089c64873ced5d200cd42a22",  // p. 300
  hints: [
    "Each of them fears the element of their own bloodline. Effia was born the night of a great fire. Esi was carried away across the ocean.",
    "At the end of the novel, a fire burns right at the water's edge. Marjorie has to walk past the flames, and Marcus has to walk into the waves.",
    "Her words are two words long, and they answer this game's slogan: Find your way ____."
  ]
};
