/* Room content lives here so room writers can edit text without touching game.js.
   Answers are never stored in plain text. Each card stores the SHA-256 hash of
   "<salt><cardId>|<correct zone>" where zone is U (Upstairs) or D (Dungeon).
   To make new hashes: node tools/hash.js "tsos-r1|c1|D"  */

window.ROOMS = [
  { id: 1, name: "The Castle",      era: "Cape Coast Castle · 1760s", screen: "room1" },
  { id: 2, name: "The Family Tree", era: "Seven generations" },
  { id: 3, name: "The Mines",       era: "Alabama · after Reconstruction" },
  { id: 4, name: "Homecoming",      era: "Cape Coast · present day" }
];

window.ROOM1 = {
  salt: "tsos-r1|",
  // Shown in this order (deliberately mixed). Fact-checked against the book; page numbers are
  // the printed book pages (PDF page minus 18 in our copy).
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
