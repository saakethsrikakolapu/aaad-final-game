(() => {
  "use strict";

  const STORE_KEY = "tsos-progress-v1";
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // ---------- saved state (localStorage is optional; the game works without it) ----------
  const fresh = () => ({
    startedAt: null,
    finishedAt: null,
    solved: {},
    r1: { placement: {}, hintsUsed: 0 },
    r2: { placement: {}, hintsUsed: 0 },
    r3: { answers: {}, hintsUsed: 0 },
    r4: { moments: {}, momentsOk: false, hintsUsed: 0 }
  });
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const base = fresh();
        for (const k of ["r1", "r2", "r3", "r4"]) saved[k] = Object.assign(base[k], saved[k]);
        return Object.assign(base, saved);
      }
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
  const canHash = () => !!(window.crypto && crypto.subtle);

  // ---------- stone graphic (4 fragments) ----------
  const FRAGS = [
    "M50,52 L7,52 L22,18 L50,8 Z",
    "M50,52 L50,8 L78,16 L93,45 Z",
    "M50,52 L93,45 L84,78 L52,94 Z",
    "M50,52 L52,94 L20,84 L7,52 Z"
  ];
  const FLECKS = [[28, 34], [70, 28], [72, 66], [32, 72]];
  const solvedCount = () => Object.keys(state.solved).length;

  function stoneSVG() {
    const got = solvedCount();
    const frags = FRAGS.map((d, i) => `<path class="frag ${i < got ? "got" : ""}" d="${d}"/>`).join("");
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
  const SCREENS = ["title", "howto", "map", "room1", "room1-done", "room2", "room2-done",
                   "room3", "room3-done", "room4", "end"];
  const RENDER = {};

  function show(name) {
    SCREENS.forEach((s) => { $("#screen-" + s).hidden = s !== name; });
    $("#topbar").hidden = name === "title" || name === "howto";
    if (name === "title") renderTitle();
    if (name === "map") renderMap();
    if (RENDER[name]) RENDER[name]();
    if (name.endsWith("-done") || name === "end") {
      $$("#screen-" + name + " .done-stone").forEach((el) => { el.innerHTML = stoneSVG(); });
    }
    if (name === "end") renderEnd();
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
    const next = window.ROOMS.find((r) => !state.solved[r.id]);
    show(next ? next.screen : "end");
  }

  // ---------- map ----------
  const NUMBER_WORDS = ["one", "two", "three", "four"];

  function renderMap() {
    const map = $("#map");
    map.innerHTML = "";
    window.ROOMS.forEach((room, i) => {
      const solved = !!state.solved[room.id];
      const prevSolved = i === 0 || !!state.solved[window.ROOMS[i - 1].id];
      const open = prevSolved && !solved;

      const li = document.createElement("li");
      li.className = "station " + (solved ? "solved" : open ? "open" : "locked");
      li.innerHTML = `<span class="station-node" aria-hidden="true"></span>`;

      const card = document.createElement("button");
      card.className = "station-card";
      const pips = [0, 1, 2, 3].map((p) => `<i class="${p <= i ? "on" : ""}"></i>`).join("");
      card.innerHTML = `<span class="num">room ${NUMBER_WORDS[i]}
          <span class="level-tag" aria-label="Difficulty ${i + 1} of 4: ${room.level}">${pips}${room.level}</span></span>
        <span class="name">${room.name}</span>
        <span class="era">${room.era}</span>
        <span class="status">${solved ? "Solved" : open ? "Enter →" : "Locked"}</span>`;
      if (open || solved) {
        const target = solved ? (room.id === 4 ? "end" : room.screen + "-done") : room.screen;
        card.addEventListener("click", () => show(target));
      } else {
        card.disabled = true;
      }
      li.appendChild(card);
      map.appendChild(li);
    });
  }

  // ---------- timer + fragments ----------
  function elapsedSeconds() {
    if (!state.startedAt) return 0;
    return Math.floor(((state.finishedAt || Date.now()) - state.startedAt) / 1000);
  }
  function fmt(s) {
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }
  function updateStats() {
    const got = solvedCount();
    $("#pips").innerHTML = [0, 1, 2, 3].map((i) => `<span class="pip ${i < got ? "got" : ""}"></span>`).join("");
    $("#pips").setAttribute("aria-label", `${got} of 4 stone fragments recovered`);
    $("#timer").textContent = fmt(elapsedSeconds());
  }

  // ---------- shared room helpers ----------
  function setFeedback(n, msg, kind) {
    const f = $("#feedback" + n);
    f.textContent = msg;
    f.className = "feedback " + (kind || "");
  }

  function renderHints(n) {
    const data = window["ROOM" + n], used = state["r" + n].hintsUsed;
    $("#hints" + n).innerHTML = data.hints.slice(0, used)
      .map((h, i) => `<div class="hint"><b>Hint ${i + 1}</b>${h}</div>`).join("");
    const left = data.hints.length - used;
    $("#hint" + n).textContent = left ? `Hint (${left} left)` : "No hints left";
    $("#hint" + n).disabled = left === 0;
  }

  function solveRoom(n) {
    state.solved[n] = true;
    if (n === 4) state.finishedAt = Date.now();
    save();
    updateStats();
    setTimeout(() => show(n === 4 ? "end" : `room${n}-done`), 1100);
  }

  function makeBtn(label, cls, onClick) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
  }

  function noCrypto(n) {
    setFeedback(n, "This browser can't check answers here. Open the game over https.", "bad");
  }

  // ---------- Room 1: sort the memories ----------
  const R1 = window.ROOM1;

  RENDER.room1 = function renderRoom1() {
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
          makeBtn("Upstairs", "to-up", () => place1(card.id, "U")),
          makeBtn("Dungeon", "to-down", () => place1(card.id, "D"))
        );
        el.appendChild(actions);
        pool.appendChild(el);
      } else {
        el.appendChild(makeBtn("Move back", "return", () => place1(card.id, null)));
        (where === "U" ? up : down).appendChild(el);
      }
    });

    const left = R1.cards.length - Object.keys(state.r1.placement).length;
    $("#poolCount").textContent = left ? `${left} left to place` : "";
    $("#check1").disabled = left > 0;
    renderHints(1);
  };

  function place1(id, zone) {
    if (zone) state.r1.placement[id] = zone;
    else delete state.r1.placement[id];
    save();
    setFeedback(1, "");
    RENDER.room1();
  }

  async function check1() {
    if (!canHash()) return noCrypto(1);
    const results = await Promise.all(R1.cards.map(async (c) =>
      (await sha256(R1.salt + c.id + "|" + state.r1.placement[c.id])) === c.hash));
    const right = results.filter(Boolean).length;
    if (right === R1.cards.length) {
      $$("#screen-room1 .zone .card").forEach((el) => el.classList.add("right"));
      setFeedback(1, "Every memory is where it belongs.", "good");
      solveRoom(1);
    } else {
      setFeedback(1, `${right} of ${R1.cards.length} memories are in the right place. Talk it through and try again.`, "bad");
    }
  }

  // ---------- Room 2: rebuild the family tree ----------
  const R2 = window.ROOM2;
  const SLOT_IDS = Object.keys(R2.slots);
  const CLUES = Object.fromEntries(R2.names.map((n) => [n.name, n.clue]));
  let selectedName = null;

  RENDER.room2 = function renderRoom2() {
    const placed = new Set(Object.values(state.r2.placement));
    if (selectedName && placed.has(selectedName)) selectedName = null;

    // name bank
    const bank = $("#bank");
    bank.innerHTML = "";
    R2.names.filter((n) => !placed.has(n.name)).forEach(({ name, clue }) => {
      const chip = makeBtn("", "chip clued" + (name === selectedName ? " selected" : ""), () => {
        if (dragJustEnded) return;
        selectedName = selectedName === name ? null : name;
        setFeedback(2, "");
        RENDER.room2();
      });
      chip.dataset.name = name;
      chip.innerHTML = `<span class="chip-name"></span><span class="chip-clue"></span>`;
      chip.querySelector(".chip-name").textContent = name;
      chip.querySelector(".chip-clue").textContent = clue;
      chip.setAttribute("aria-pressed", String(name === selectedName));
      attachDrag(chip, name, null);
      bank.appendChild(chip);
    });
    const left = SLOT_IDS.length - Object.keys(state.r2.placement).length;
    $("#bankCount").textContent = left ? `${left} slots left` : "";

    // tree rows
    const tree = $("#tree");
    tree.innerHTML = "";
    for (let g = 1; g <= 7; g++) {
      const row = document.createElement("div");
      row.className = "tree-row";
      row.innerHTML = `<span class="gen-label"><span class="gen-word">Gen</span> ${g}</span>`;
      ["F", "W"].forEach((line) => {
        if (g === 1) {
          const fixed = document.createElement("div");
          fixed.className = `slot fixed ${line === "F" ? "fire" : "water"}`;
          fixed.textContent = line === "F" ? "Effia" : "Esi";
          row.appendChild(fixed);
          return;
        }
        const id = line + g;
        const name = state.r2.placement[id];
        const slot = makeBtn(name || (selectedName ? "Place here" : "Empty"),
          `slot ${line === "F" ? "fire" : "water"} ${name ? "filled" : "empty"} ${selectedName && !name ? "ready" : ""}`,
          () => tapSlot(id));
        slot.dataset.slot = id;
        slot.setAttribute("aria-label", `${line === "F" ? "Effia's" : "Esi's"} line, generation ${g}: ${name || "empty"}`);
        if (name) {
          slot.innerHTML = `<span class="slot-name"></span><span class="slot-clue"></span>`;
          slot.querySelector(".slot-name").textContent = name;
          slot.querySelector(".slot-clue").textContent = CLUES[name] || "";
          attachDrag(slot, name, id);
        }
        row.appendChild(slot);
      });
      tree.appendChild(row);
    }
    $("#check2").disabled = left > 0;
    renderHints(2);
  };

  function tapSlot(id) {
    if (dragJustEnded) return;
    const current = state.r2.placement[id];
    if (selectedName) {
      state.r2.placement[id] = selectedName;   // a name already here goes back to the bank
      selectedName = null;
    } else if (current) {
      delete state.r2.placement[id];
    } else {
      setFeedback(2, "Drag a name here, or tap a name first and then tap this slot.", "");
      return;
    }
    save();
    setFeedback(2, "");
    RENDER.room2();
  }

  // ----- drag and drop (pointer events, so it works with a mouse and on touchscreens) -----
  // Names drag from the bank onto a slot. Placed names can be dragged to another slot (swapping
  // if it's taken) or back to the bank. On touchscreens only bank names drag, so a finger on the
  // tree still scrolls the page; placed names there are moved by tapping instead.
  let drag = null, dragJustEnded = false, scrollLoop = null;

  function attachDrag(el, name, fromSlot) {
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || (fromSlot && e.pointerType === "touch")) return;
      drag = { name, fromSlot, el, pid: e.pointerId, x0: e.clientX, y0: e.clientY,
               x: e.clientX, y: e.clientY, active: false, ghost: null, target: null };
    });
  }

  function startDrag() {
    drag.active = true;
    selectedName = null;
    $$("#bank .chip.selected").forEach((c) => c.classList.remove("selected"));
    drag.ghost = document.createElement("div");
    drag.ghost.className = "chip drag-ghost";
    drag.ghost.textContent = drag.name;
    document.body.appendChild(drag.ghost);
    drag.el.classList.add("drag-source");
    document.body.classList.add("is-dragging");
    scrollLoop = setInterval(autoScroll, 16);
  }

  function onPointerMove(e) {
    if (!drag || e.pointerId !== drag.pid) return;
    drag.x = e.clientX;
    drag.y = e.clientY;
    if (!drag.active) {
      if (Math.hypot(drag.x - drag.x0, drag.y - drag.y0) < 6) return;   // still a tap
      startDrag();
    }
    e.preventDefault();
    drag.ghost.style.left = drag.x + "px";
    drag.ghost.style.top = drag.y + "px";
    updateDropTarget();
  }

  function updateDropTarget() {
    const under = document.elementFromPoint(drag.x, drag.y);
    const t = under && (under.closest("#tree button.slot") || under.closest("#bank"));
    if (t === drag.target) return;
    if (drag.target) drag.target.classList.remove("drop-target");
    drag.target = t;
    if (t) t.classList.add("drop-target");
  }

  // Scroll the page when dragging near the top or bottom edge (the tree can be below the fold on phones).
  function autoScroll() {
    if (!drag || !drag.active) return;
    const edge = 70, top = $("#topbar").offsetHeight + edge;
    let dy = 0;
    if (drag.y < top) dy = -Math.ceil((top - drag.y) / 6);
    else if (drag.y > window.innerHeight - edge) dy = Math.ceil((drag.y - (window.innerHeight - edge)) / 6);
    if (dy) { window.scrollBy(0, dy); updateDropTarget(); }
  }

  function endDrag() {
    if (drag.ghost) drag.ghost.remove();
    drag.el.classList.remove("drag-source");
    if (drag.target) drag.target.classList.remove("drop-target");
    document.body.classList.remove("is-dragging");
    clearInterval(scrollLoop);
    const d = drag;
    drag = null;
    return d;
  }

  function onPointerUp(e) {
    if (!drag || e.pointerId !== drag.pid) return;
    const d = endDrag();
    if (!d.active) return;                     // it was a tap; the click handler takes over
    dragJustEnded = true;                      // swallow the click that follows this pointerup
    setTimeout(() => { dragJustEnded = false; }, 0);

    const t = d.target;
    if (t && t.id === "bank") {
      if (d.fromSlot) delete state.r2.placement[d.fromSlot];
    } else if (t && t.dataset.slot && t.dataset.slot !== d.fromSlot) {
      const to = t.dataset.slot, displaced = state.r2.placement[to];
      state.r2.placement[to] = d.name;
      if (d.fromSlot) {
        if (displaced) state.r2.placement[d.fromSlot] = displaced;   // swap the two names
        else delete state.r2.placement[d.fromSlot];
      }
    } else {
      RENDER.room2();
      return;
    }
    save();
    setFeedback(2, "");
    RENDER.room2();
  }

  window.addEventListener("pointermove", onPointerMove, { passive: false });
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", (e) => {
    if (drag && e.pointerId === drag.pid) { endDrag(); RENDER.room2(); }
  });

  async function check2() {
    if (!canHash()) return noCrypto(2);
    const results = await Promise.all(SLOT_IDS.map(async (id) =>
      (await sha256(R2.salt + id + "|" + state.r2.placement[id])) === R2.slots[id]));
    const right = results.filter(Boolean).length;
    if (right === SLOT_IDS.length) {
      $$("#tree .slot.filled").forEach((el) => el.classList.add("right"));
      setFeedback(2, "Both bloodlines are whole again.", "good");
      solveRoom(2);
    } else {
      setFeedback(2, `${right} of ${SLOT_IDS.length} names are in the right place. Talk it through and try again.`, "bad");
    }
  }

  // ---------- Room 3: complete H's record ----------
  const R3 = window.ROOM3;
  const FIELD_IDS = Object.keys(R3.fields);

  function buildRoom3() {
    $$("#screen-room3 select[data-field]").forEach((sel) => {
      const f = R3.fields[sel.dataset.field];
      sel.innerHTML = `<option value="">choose…</option>` +
        f.options.map((o) => `<option value="${o}">${o}</option>`).join("");
      sel.addEventListener("change", () => {
        if (sel.value) state.r3.answers[sel.dataset.field] = sel.value;
        else delete state.r3.answers[sel.dataset.field];
        save();
        setFeedback(3, "");
        RENDER.room3();
      });
    });
  }

  RENDER.room3 = function renderRoom3() {
    $$("#screen-room3 select[data-field]").forEach((sel) => {
      sel.value = state.r3.answers[sel.dataset.field] || "";
      sel.classList.toggle("filled", !!sel.value);
      sel.classList.remove("right");
    });
    $("#check3").disabled = FIELD_IDS.some((id) => !state.r3.answers[id]);
    renderHints(3);
  };

  async function check3() {
    if (!canHash()) return noCrypto(3);
    const results = await Promise.all(FIELD_IDS.map(async (id) =>
      (await sha256(R3.salt + id + "|" + state.r3.answers[id])) === R3.fields[id].hash));
    const right = results.filter(Boolean).length;
    if (right === FIELD_IDS.length) {
      $$("#screen-room3 select").forEach((el) => el.classList.add("right"));
      setFeedback(3, "H's record is complete.", "good");
      solveRoom(3);
    } else {
      setFeedback(3, `${right} of ${FIELD_IDS.length} blanks are correct. Talk it through and try again.`, "bad");
    }
  }

  // ---------- Room 4: fears, then the last words ----------
  const R4 = window.ROOM4;

  function buildRoom4() {
    const wrap = $("#moments");
    wrap.innerHTML = "";
    R4.moments.forEach((m) => {
      const row = document.createElement("div");
      row.className = "fear-row moment-row";
      row.dataset.id = m.id;
      const text = document.createElement("p");
      text.className = "moment-text";
      text.textContent = m.text;
      const toggle = document.createElement("div");
      toggle.className = "toggle";
      toggle.setAttribute("role", "group");
      toggle.setAttribute("aria-label", "Fire or water");
      [["fire", "Fire", "tog-fire"], ["water", "Water", "tog-water"]].forEach(([val, label, cls]) => {
        toggle.appendChild(makeBtn(label, cls, () => {
          state.r4.moments[m.id] = val;
          save();
          setFeedback(4, "");
          RENDER.room4();
        }));
        toggle.lastChild.dataset.val = val;
      });
      row.append(text, toggle);
      wrap.appendChild(row);
    });
  }

  RENDER.room4 = function renderRoom4() {
    const done = state.r4.momentsOk;
    $$("#moments .moment-row").forEach((row) => {
      const chosen = state.r4.moments[row.dataset.id];
      row.querySelectorAll("button").forEach((b) => {
        const on = b.dataset.val === chosen;
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", String(on));
        b.disabled = done;
      });
    });
    $("#step1").classList.toggle("done", done);
    $("#checkFears").hidden = done;
    $("#checkFears").disabled = R4.moments.some((m) => !state.r4.moments[m.id]);
    $("#step2").hidden = !done;
    renderHints(4);
  };

  async function checkFears() {
    if (!canHash()) return noCrypto(4);
    const results = await Promise.all(R4.moments.map(async (m) =>
      (await sha256(R4.salt + m.id + "|" + state.r4.moments[m.id])) === m.hash));
    const right = results.filter(Boolean).length;
    if (right === R4.moments.length) {
      state.r4.momentsOk = true;
      save();
      setFeedback(4, "Right. Fire follows Effia's family, and water follows Esi's. One last step.", "good");
      RENDER.room4();
      $("#step2").scrollIntoView({ behavior: "smooth", block: "center" });
      $("#wordsInput").focus({ preventScroll: true });
    } else {
      setFeedback(4, `${right} of ${R4.moments.length} moments are marked correctly. Think about whose bloodline each person belongs to.`, "bad");
    }
  }

  async function checkWords(e) {
    e.preventDefault();
    if (!canHash()) return noCrypto(4);
    const typed = $("#wordsInput").value.toUpperCase().replace(/[^A-Z]/g, "");
    if (!typed) return;
    if ((await sha256(R4.salt + "words|" + typed)) === R4.words) {
      setFeedback(4, "The stone is whole.", "good");
      solveRoom(4);
    } else {
      setFeedback(4, "That's not what she says. Think about this game's slogan.", "bad");
    }
  }

  // ---------- ending ----------
  function renderEnd() {
    $("#endTime").textContent = fmt(elapsedSeconds());
    const hints = [1, 2, 3, 4].reduce((sum, n) => sum + state["r" + n].hintsUsed, 0);
    $("#endHints").textContent = `${hints} of 12`;
  }

  // ---------- wiring ----------
  function init() {
    injectDefs();
    buildRoom3();
    buildRoom4();

    $$("[data-go]").forEach((b) => b.addEventListener("click", () => show(b.dataset.go)));
    $$("[data-next]").forEach((b) => b.addEventListener("click", () => show("room" + b.dataset.next)));
    $("#startBtn").addEventListener("click", start);
    $("#startBtn2").addEventListener("click", start);

    $("#check1").addEventListener("click", check1);
    $("#check2").addEventListener("click", check2);
    $("#check3").addEventListener("click", check3);
    $("#checkFears").addEventListener("click", checkFears);
    $("#wordsForm").addEventListener("submit", checkWords);

    [1, 2, 3, 4].forEach((n) => $("#hint" + n).addEventListener("click", () => {
      const r = state["r" + n];
      if (r.hintsUsed < window["ROOM" + n].hints.length) { r.hintsUsed++; save(); renderHints(n); }
    }));

    $$(".js-restart").forEach((b) => b.addEventListener("click", () => {
      if (!confirm("Restart the game? This erases all progress and resets the timer.")) return;
      state = fresh();
      selectedName = null;
      save();
      [1, 2, 3, 4].forEach((n) => setFeedback(n, ""));
      $("#wordsInput").value = "";
      show("title");
    }));

    setInterval(updateStats, 1000);
    show("title");
  }

  init();
})();
