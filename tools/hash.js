// Usage: node tools/hash.js "tsos-r1|c1|D"
// Prints the SHA-256 hex digest to paste into js/rooms.js.
const input = process.argv[2];
if (!input) {
  console.error('Usage: node tools/hash.js "<salt><id>|<answer>"');
  process.exit(1);
}
console.log(require("crypto").createHash("sha256").update(input).digest("hex"));
