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
  // Shown in this order (deliberately mixed). Fact-check each against the book before final submission.
  cards: [
    { id: "c1", text: "Is the daughter of a Big Man in an Asante village.",
      hash: "a5335e59aaddb896addf6070803b93fe391bf9eed5808f70994f99ca2ba37da6" },
    { id: "c2", text: "Is married to James Collins, the British governor of Cape Coast Castle.",
      hash: "fbb37be54265c33715b6a21324506fccd1c85a2bb8968e32c5fcaee1731712f9" },
    { id: "c3", text: "Is packed into the dark with dozens of captive women, beneath the floors where soldiers walk.",
      hash: "19d8cd912848e36b222ae1c39b448e4b2a62283dd203997f71b546ca43b24f75" },
    { id: "c4", text: "Grows up believing that Baaba is her mother.",
      hash: "70207f2d58127a166c1a0bc422666ffd839d1f739b8e41e415b7fd809df2126d" },
    { id: "c5", text: "Is handed a black stone by the woman who raised her, on the day she leaves home to marry.",
      hash: "0a8c6944ae82d89fd9c447e10a1fef932e185df28f888c94e6b849e015c436be" },
    { id: "c6", text: "Her family once bought a girl named Abronoma to work in their home.",
      hash: "0f058e9d7c5c8370f99918727f8414790f0cdc455fe5c6f06ddc4782f5338b58" },
    { id: "c7", text: "Gives birth to a son named Quey.",
      hash: "4b9a48ce88fb5e4c8903d310663e4cfbe681bba74e7bed78a04e2406b99e7a63" },
    { id: "c8", text: "Leaves her mother's black stone behind when she is forced onto a ship.",
      hash: "95e1b7a6ee7caea2285e13b38344e185cd78ea57d035444f6cf2df2574ff897d" }
  ],
  hints: [
    "Two sisters, one building. One has a home inside the castle. The other is held captive beneath it.",
    "Effia grows up in Fanteland and is married off to a British official. Esi grows up in Asanteland and is captured in a raid.",
    "Both sisters carry a black stone from Maame, but only one of them knew Maame as her mother growing up."
  ]
};
