(() => {
  "use strict";

  const STORE_KEY = "tsos-progress-v1";
  const $ = (sel) => document.querySelector(sel);

  // ---------- saved state (localStorage is optional; game works without it) ----------
  const fresh = () => ({ startedAt: null, solved: {}, r1: { placement: {}, hintsUsed: 0 } });
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return Object.assign(fresh(), JSON.parse(raw));
    } catch (e) { /* private mode or blocked storage */ }
    return fresh();
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ---------- hashing ----------
  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // ---------- stone graphic (4 fragments) ----------
  const FRAGS = [
    "M50,52 L7,52 L22,18 L50,8 Z",
    "M50,52 L50,8 L78,16 L93,45 Z",
    "M50,52 L93,45 L84,78 L52,94 Z",
    "M50,52 L52,94 L20,84 L7,52 Z"
  ];
  const FLECKS = [[28, 34], [70, 28], [72, 66], [32, 72]];

  function stoneSVG() {
    const got = Object.keys(state.solved).length;
    const frags = FRAGS.map((d, i) =>
      `<path class="frag ${i < got ? "got" : ""}" d="${d}"/>`).join("");
    const flecks = FLECKS.map(([x, y], i) =>
      `<circle class="fleck ${i < got ? "got" : ""}" cx="${x}" cy="${y}" r="2.2"/>`).join("");
    return `<svg class="stone-svg" viewBox="0 0 100 100" role="img" aria-label="${got} of 4 stone fragments">${frags}${flecks}</svg>`;
  }

  function injectDefs() {
    // Shared gradient lives in an always-rendered (not display:none) SVG.
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    defs.setAttribute("width", "0");
    defs.setAttribute("height", "0");
    defs.setAttribute("aria-hidden", "true");
    defs.style.position = "absolute";
    defs.innerHTML = `<defs><radialGradient id="stoneFill" cx="35%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#5a4d42"/><stop offset="100%" stop-color="#0e0c0a"/></radialGradient></defs>`;
    document.body.prepend(defs);
  }

  // ---------- screens ----------
  const SCREENS = ["title", "howto", "map", "room1", "room1-done"];
  function show(name) {
    SCREENS.forEach((s) => { $("#screen-" + s).hidden = s !== name; });
    $("#topbar").hidden = name === "title" || name === "howto";
    if (name === "title") renderTitle();
    if (name === "map") renderMap();
    if (name === "room1") renderRoom1();
    if (name === "room1-done") $("#doneStone").innerHTML = stoneSVG();
    updateStats();
    window.scrollTo(0, 0);
  }

  function renderTitle() {
    $("#titleStone").innerHTML = stoneSVG();
    const started = !!state.startedAt;
    $("#startBtn").textContent = started ? "Continue" : "Begin";
    $("#startBtn2").textContent = started ? "Continue" : "Begin";
    $("#resetBtn").hidden = !started;
  }

  function start() {
    if (!state.startedAt) { state.startedAt = Date.now(); save(); }
    show(state.solved[1] ? "map" : "room1");
  }

  // ---------- map ----------
  const NUMBER_WORDS = ["one", "two", "three", "four"];

  function renderMap() {
    const map = $("#map");
    map.innerHTML = "";
    window.ROOMS.forEach((room, i) => {
      const solved = !!state.solved[room.id];
      const prevSolved = i === 0 || !!state.solved[window.ROOMS[i - 1].id];
      const built = !!room.screen;
      const open = prevSolved && built && !solved;

      let status = "Locked";
      if (solved) status = "Solved";
      else if (open) status = "Enter →";
      else if (prevSolved && !built) status = "Being written";

      const li = document.createElement("li");
      li.className = "station " + (solved ? "solved" : open ? "open" : "locked");
      li.innerHTML = `<span class="station-node" aria-hidden="true"></span>`;

      const card = document.createElement("button");
      card.className = "station-card";
      card.innerHTML = `<span class="num">room ${NUMBER_WORDS[i]}</span>
        <span class="name">${room.name}</span>
        <span class="era">${room.era}</span>
        <span class="status">${status}</span>`;
      if (open || solved) card.addEventListener("click", () => show(room.screen + (solved ? "-done" : "")));
      else card.disabled = true;

      li.appendChild(card);
      map.appendChild(li);
    });
  }

  // ---------- timer + fragments ----------
  function updateStats() {
    const got = Object.keys(state.solved).length;
    $("#pips").innerHTML = [0, 1, 2, 3].map((i) => `<span class="pip ${i < got ? "got" : ""}"></span>`).join("");
    $("#pips").setAttribute("aria-label", `${got} of 4 stone fragments recovered`);
    if (!state.startedAt) { $("#timer").textContent = "00:00"; return; }
    const s = Math.floor((Date.now() - state.startedAt) / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    $("#timer").textContent = `${mm}:${ss}`;
  }

  // ---------- room 1: sort the memories ----------
  const R1 = window.ROOM1;

  function renderRoom1() {
    const pool = $("#pool"), up = $("#zone-U"), down = $("#zone-D");
    pool.innerHTML = up.innerHTML = down.innerHTML = "";

    R1.cards.forEach((card) => {
      const where = state.r1.placement[card.id];
      const el = document.createElement("div");
      el.className = "card";
      el.dataset.id = card.id;

      const text = document.createElement("div");
      text.textContent = card.text;
      el.appendChild(text);

      if (!where) {
        const actions = document.createElement("div");
        actions.className = "card-actions";
        actions.append(
          makeBtn("Upstairs", "to-up", () => place(card.id, "U")),
          makeBtn("Dungeon", "to-down", () => place(card.id, "D"))
        );
        el.appendChild(actions);
        pool.appendChild(el);
      } else {
        el.appendChild(makeBtn("Move back", "return", () => place(card.id, null)));
        (where === "U" ? up : down).appendChild(el);
      }
    });

    const left = R1.cards.length - Object.keys(state.r1.placement).length;
    $("#poolCount").textContent = left ? `${left} left to place` : "";
    $("#checkBtn").disabled = left > 0;
    renderHints();
  }

  function makeBtn(label, cls, onClick) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
  }

  function place(id, zone) {
    if (zone) state.r1.placement[id] = zone;
    else delete state.r1.placement[id];
    save();
    setFeedback("", "");
    renderRoom1();
  }

  async function checkRoom1() {
    if (!window.crypto || !crypto.subtle) {
      setFeedback("This browser can't check answers here. Open the game over https.", "bad");
      return;
    }
    const results = await Promise.all(R1.cards.map(async (c) => {
      const zone = state.r1.placement[c.id];
      return (await sha256(R1.salt + c.id + "|" + zone)) === c.hash;
    }));
    const right = results.filter(Boolean).length;

    if (right === R1.cards.length) {
      document.querySelectorAll("#screen-room1 .zone .card").forEach((el) => el.classList.add("right"));
      setFeedback("Every memory is where it belongs.", "good");
      state.solved[1] = true;
      save();
      updateStats();
      setTimeout(() => show("room1-done"), 1100);
    } else {
      setFeedback(`${right} of ${R1.cards.length} memories are in the right place. Talk it through and try again.`, "bad");
    }
  }

  function setFeedback(msg, kind) {
    const f = $("#feedback");
    f.textContent = msg;
    f.className = "feedback " + kind;
  }

  function renderHints() {
    const used = state.r1.hintsUsed;
    $("#hints").innerHTML = R1.hints.slice(0, used)
      .map((h, i) => `<div class="hint"><b>Hint ${i + 1}</b>${h}</div>`).join("");
    const left = R1.hints.length - used;
    $("#hintBtn").textContent = left ? `Hint (${left} left)` : "No hints left";
    $("#hintBtn").disabled = left === 0;
  }

  // ---------- wiring ----------
  function init() {
    injectDefs();
    document.querySelectorAll("[data-go]").forEach((b) =>
      b.addEventListener("click", () => show(b.dataset.go)));
    $("#startBtn").addEventListener("click", start);
    $("#startBtn2").addEventListener("click", start);
    $("#checkBtn").addEventListener("click", checkRoom1);
    $("#hintBtn").addEventListener("click", () => {
      if (state.r1.hintsUsed < R1.hints.length) { state.r1.hintsUsed++; save(); renderHints(); }
    });
    document.querySelectorAll(".js-restart").forEach((b) => b.addEventListener("click", () => {
      if (!confirm("Restart the game? This erases all progress and resets the timer.")) return;
      state = fresh();
      save();
      setFeedback("", "");
      show("title");
    }));
    setInterval(updateStats, 1000);
    show("title");
  }

  init();
})();
