/* =========================================================================
   MINISTRY OF TRUTH  —  infinite edition

   You are a censor at the Ministry. On paper you are loyal; in truth you
   carry a second name, whispered in the tunnels beneath District 9.

   THE LOOP
   - Each DAY has 3 sessions of 6 letters (18 letters a day). It never ends;
     the forbidden subjects rotate and escalate every day.
   - Pick up the MARKER and black out any words that break today's Standing
     Orders, then FILE the document. A clean letter you simply FILE untouched.
   - RATIONS are your survival. Every mistake costs one; a flawless session
     earns one back. Reach zero and your family starves.
   - Some letters are true and human. The rules still demand you bury them.
     LET ONE PASS instead (file it untouched) and you defy the regime: it
     costs a ration, but it feeds the RESISTANCE. Fill that meter and the
     uprising comes.

   This is the TypeScript source. It compiles to ../game.js (see tsconfig.json),
   which the HTML loads. Edit this file, not the generated .js.
   ========================================================================= */

/* ---------- TYPES ---------- */

/** The five subjects the regime censors. A letter is only "in violation" of a
 *  topic on days when that topic appears in the forbidden list. */
type TopicKey = "eastern" | "shortage" | "vale" | "uprising" | "escape";

/** A sensitive run of words inside a letter, tagged with the topic it touches. */
interface Phrase {
  readonly t: string;
  readonly topic: TopicKey;
}

/** A letter body is a sequence of plain strings and tagged phrases. */
type Part = string | Phrase;

interface Letter {
  readonly from: string;
  readonly subject: string;
  readonly parts: ReadonlyArray<Part>;
  /** A true, human plea. Redacting it is "safe" but a quiet betrayal; letting
   *  it pass is defiance that feeds the Resistance. */
  readonly conscience?: boolean;
}

/** A single word on the desk. `topic` is set when the word came from a tagged
 *  phrase; `blacked` tracks whether the player has redacted it. */
interface Token {
  readonly word: string;
  readonly topic: TopicKey | null;
  blacked: boolean;
}

/* ---------- TOPICS ---------- */

const TOPIC_KEYS: TopicKey[] = ["eastern", "shortage", "vale", "uprising", "escape"];

const RULE_TEXT: Record<TopicKey, string> = {
  eastern:  "Redact all mention of the Eastern Sector.",
  shortage: "Redact all mention of shortages, hunger, or empty shelves.",
  vale:     "Redact all mention of Minister Vale. There is no Minister Vale.",
  uprising: "Redact all mention of the uprising, protests, or unrest.",
  escape:   "Redact all mention of the border, defection, or leaving the State.",
};

const LABEL: Record<TopicKey, string> = {
  eastern:  "the Eastern Sector",
  shortage: "shortages or hunger",
  vale:     "Minister Vale",
  uprising: "the uprising",
  escape:   "the border",
};

/** Small helper: P(text, topic) marks a sensitive phrase inside a letter. */
const P = (t: string, topic: TopicKey): Phrase => ({ t, topic });

/* ---------- THE LETTER POOL ----------
   parts: a mix of plain strings and P(...) phrases. Write parts WITHOUT
   worrying about spacing — every word is rejoined with a single space.
   conscience: true  ->  a true, human plea (see the Letter type).

   AUTHORING RULE (keep new letters in context):
   The forbidden topics rotate at random, so EVERY letter must make sense
   BOTH when its topic is banned (you black the phrase out) AND when it is
   allowed (you approve it clean). So a tagged mention must read as something
   the regime would plausibly bury — neutral, bureaucratic, or human. Never
   write present-tense PRAISE of a topic ("our most loyal district!"), because
   blacking out praise reads as nonsense. Denial and doublespeak are perfect
   ("There is no shortage" — redacting the banned word is peak Ministry). */
const LETTERS: Letter[] = [
  /* ---- EASTERN SECTOR (a district being quietly erased) ---- */
  { from: "Rail Authority", subject: "Line Closure",
    parts: ["Service to", P("the Eastern Sector", "eastern"),
      "is suspended indefinitely. Passengers holding tickets should not inquire further."] },

  { from: "Weather Office", subject: "Forecast",
    parts: ["Clear skies over the capital. Conditions in", P("the Eastern Sector", "eastern"),
      "remain unreported and will continue to remain unreported."] },

  { from: "Cartography Office", subject: "Fourth Edition",
    parts: [P("The Eastern Sector", "eastern"),
      "has been removed from the new maps. Recall every third edition for pulping."] },

  { from: "Census Bureau", subject: "Statistical Note",
    parts: ["Population figures for", P("the Eastern Sector", "eastern"),
      "have been set to zero for convenience. The convenience is ours."] },

  { from: "Schoolteacher, District 9", subject: "Curriculum Query", conscience: true,
    parts: ["The children ask why", P("the Eastern Sector", "eastern"),
      "is absent from the new maps. I need an approved answer before Thursday, or I must tell them the truth."] },

  { from: "Postal Service", subject: "Undeliverable", conscience: true,
    parts: ["Six hundred letters addressed to", P("the Eastern Sector", "eastern"),
      "cannot be delivered. There is no forwarding address. There are no forwarding people."] },

  /* ---- SHORTAGE (hunger the State insists does not exist) ---- */
  { from: "Warehouse 12", subject: "Inventory",
    parts: [P("Grain reserves are depleted", "shortage"),
      ". We have three days. Requesting immediate resupply from the central depot."] },

  { from: "Ministry of Plenty", subject: "Correction",
    parts: ["Reports of", P("empty shelves", "shortage"),
      "in District 3 are the work of saboteurs. The shelves are full. Photographs to follow."] },

  { from: "Rationing Office", subject: "Adjustment",
    parts: ["The bread ration is halved. This is not a", P("shortage", "shortage"),
      ". It is a test of loyalty, and you are passing."] },

  { from: "Hospital, District 3", subject: "Admissions", conscience: true,
    parts: ["Forty-one children admitted this week for", P("malnutrition", "shortage"),
      ". We are calling it seasonal fatigue in the paperwork."] },

  { from: "Warehouse 12", subject: "Final Report", conscience: true,
    parts: ["There is", P("no grain", "shortage"), ". There are", P("no reserves", "shortage"),
      ". I am writing this knowing what you will do with it."] },

  { from: "Baker, District 7", subject: "Notice", conscience: true,
    parts: ["We can bake for two more days. After that", P("the district goes hungry", "shortage"),
      ", and it will know exactly whose signature let it."] },

  /* ---- MINISTER VALE (a purged official, unpersoned) ---- */
  { from: "Records Office", subject: "Urgent",
    parts: ["The portrait of", P("Minister Vale", "vale"),
      "still hangs in the west corridor. Advise on removal procedure."] },

  { from: "Personnel", subject: "Loyalty Review",
    parts: ["All staff who once reported to", P("Minister Vale", "vale"),
      "are to submit revised loyalty statements by Friday. Omit any mention of the reason."] },

  { from: "Archive Clerk", subject: "Reissue",
    parts: ["Every document signed by", P("Minister Vale", "vale"),
      "must be reissued before the audit. Use a name that has always been there."] },

  { from: "State Portraitist", subject: "Invoice",
    parts: ["Payment requested for removing", P("Minister Vale", "vale"),
      "from the founding mural. The gap has been repainted as sky."] },

  { from: "Widow, District 2", subject: "Enquiry", conscience: true,
    parts: ["I was the wife of", P("Minister Vale", "vale"),
      ". I am now told I never married. I am asking only where he is buried."] },

  /* ---- THE UPRISING (unrest scrubbed from the record) ---- */
  { from: "City Guard", subject: "Incident",
    parts: [P("The gathering in the square", "uprising"),
      "dispersed by dawn. No such gathering occurred. Amend all logs accordingly."] },

  { from: "Bureau of Morale", subject: "Directive",
    parts: ["The word", P("strike", "uprising"),
      "is to be removed from the next dictionary. A shorter, happier edition follows."] },

  { from: "Citizen Petition #4471", subject: "Request", conscience: true,
    parts: ["I write about my brother,", P("taken after the demonstration", "uprising"),
      "on Tuesday. I am certain there has been an error."] },

  { from: "Mother, District 6", subject: "A Plea", conscience: true,
    parts: ["My son marched in", P("the uprising", "uprising"),
      ". He is nineteen. I am asking you, whoever reads this, to lose his file."] },

  { from: "Printer's Apprentice", subject: "Confession", conscience: true,
    parts: ["I set the type for", P("the pamphlets", "uprising"),
      ". I did not read them. I am beginning to wish I had."] },

  /* ---- THE BORDER (defection that officially cannot happen) ---- */
  { from: "Ministry of Loyalty", subject: "Bulletin",
    parts: ["There is no", P("emigration", "escape"),
      ". Citizens do not leave. Citizens are not permitted to want to leave."] },

  { from: "Night Watch", subject: "Report",
    parts: ["Footprints found at", P("the fence", "escape"),
      "again, leading out. We have responded by adding another fence."] },

  { from: "Border Patrol", subject: "Incident Report", conscience: true,
    parts: ["Two figures observed", P("walking east across the border", "escape"),
      "at night. They carried nothing. They did not turn around when called."] },

  { from: "Checkpoint 9", subject: "Manifest", conscience: true,
    parts: ["A family of four requested transit papers for", P("the western border", "escape"),
      ". Papers denied. They have not returned home."] },

  { from: "Harbour Master", subject: "Log", conscience: true,
    parts: ["A fishing boat left before dawn and did not return. It carried",
      P("more people than it could feed", "escape"), ". I have logged it as lost to weather."] },

  /* ---- CLEAN LETTERS (no forbidden topic — always approve) ---- */
  { from: "State Poetry Council", subject: "Approved Verse",
    parts: ["A new poem celebrating the harvest has been distributed. Every citizen should memorise thirty-two of its forty lines."] },

  { from: "Ministry of Plenty", subject: "Ration Notice",
    parts: ["The chocolate ration has been raised to twenty grams. This is an increase. Any memory of a larger ration is a personal failure."] },

  { from: "Sector 4 Broadcast", subject: "Morning Bulletin",
    parts: ["Production quotas were exceeded for the ninth consecutive quarter. Gratitude is compulsory before 0800."] },

  { from: "Transit Authority", subject: "Notice",
    parts: ["All clocks will advance one hour tonight. You have always been one hour ahead."] },

  { from: "Office of Records", subject: "Reminder",
    parts: ["Citizens are reminded to report any change of address within six hours. The State dislikes surprises."] },

  { from: "Loyalty Bureau", subject: "Commendation",
    parts: ["District 5 has denounced more neighbours than any other this month. A banner will be provided."] },

  { from: "Bureau of Weights", subject: "Notice",
    parts: ["The metre has been shortened by two centimetres to conserve steel. You are all now slightly taller."] },

  { from: "Department of Joy", subject: "Schedule",
    parts: ["Mandatory celebration is scheduled for Thursday at noon. Citizens are asked to bring their own enthusiasm."] },

  { from: "Sanitation Office", subject: "Notice",
    parts: ["Rubbish collection now falls on the third day of each week. Do not produce rubbish on the other six."] },

  { from: "State Orchestra", subject: "Programme",
    parts: ["The anthem will be performed forty times on Founding Day. Attendance will be measured in decibels."] },
];

/* ---------- TUNING ---------- */
const SESSIONS_PER_DAY = 3;
const LETTERS_PER_SESSION = 6;
const LETTERS_PER_DAY = SESSIONS_PER_DAY * LETTERS_PER_SESSION;
const RATIONS_START = 6;
const RATIONS_MAX = 10;
const RESISTANCE_START = 3;
const RESISTANCE_WIN = 12;
const TIME_BASE = 14;       // base seconds a letter may sit on your desk
const TIME_PER_WORD = 0.5;  // extra seconds per word, so long letters get longer

/* ---------- STATE ---------- */
let day = 0;
let forbidden: TopicKey[] = [];
let prevForbidden: TopicKey[] = [];
let dayQueue: Letter[] = [];
let queuePos = 0;
let rations = 0;
let resistance = 0;
let sessionMistakes = 0;
let buried = 0;
let released = 0;
let currentLetter!: Letter;        // always set by renderLetter before use
let currentTokens: Token[] = [];
let markerActive = false;
let painting = false;
let paintState = false;
let locked = false;
let clockInterval: number | null = null;
let timeLeft = 0;

/* ---------- DOM HELPERS ----------
   byId asserts the element exists (used for elements we know are on the page);
   it throws a clear error rather than silently returning null. */
function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error("Missing element #" + id);
  return node as T;
}

const viewEl = byId("view");
const statusEl = byId("status");

/* ---------- UTILITIES ---------- */
function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** A little block bar, e.g. "▰▰▰▱▱" for cur=3, max=5. */
function bar(cur: number, max: number): string {
  let s = "";
  for (let i = 0; i < max; i++) s += i < cur ? "▰" : "▱";
  return s;
}

/** Break a letter into word tokens, each carrying its topic (or null). */
function tokenize(letter: Letter): Token[] {
  const tokens: Token[] = [];
  letter.parts.forEach((part) => {
    const text = typeof part === "string" ? part : part.t;
    const topic: TopicKey | null = typeof part === "string" ? null : part.topic;
    text.trim().split(/\s+/).forEach((word) => {
      if (word) tokens.push({ word, topic, blacked: false });
    });
  });
  return tokens;
}

/* =========================================================================
   GAME FLOW
   ========================================================================= */
function startGame(): void {
  day = 0;
  rations = RATIONS_START;
  resistance = RESISTANCE_START;
  buried = 0;
  released = 0;
  prevForbidden = [];
  markerActive = false;
  startDay();
}

function startDay(): void {
  day++;
  prevForbidden = forbidden;
  // Day 1 is a gentle, known tutorial; after that, escalate and randomise.
  if (day === 1) {
    forbidden = ["eastern"];
  } else {
    const size = Math.min(day, 3);
    forbidden = shuffle(TOPIC_KEYS.slice()).slice(0, size);
  }
  // Build the day's stack of 18 letters (reshuffled; repeats allowed if needed).
  let pool = shuffle(LETTERS.slice());
  while (pool.length < LETTERS_PER_DAY) pool = pool.concat(shuffle(LETTERS.slice()));
  dayQueue = pool.slice(0, LETTERS_PER_DAY);
  queuePos = 0;
  sessionMistakes = 0;
  renderBriefing();
}

/** The morning briefing: today's Standing Orders, with changes highlighted. */
function renderBriefing(): void {
  statusEl.textContent = "";
  const added = forbidden.filter((t) => !prevForbidden.includes(t));
  const lifted = prevForbidden.filter((t) => !forbidden.includes(t));

  const orders = forbidden.map((t) => {
    const isNew = added.includes(t);
    return '<div class="' + (isNew ? "new" : "") + '">' +
      (isNew ? "→ " : "· ") + escapeHtml(RULE_TEXT[t]) + "</div>";
  }).join("");

  const liftedNote = lifted.length
    ? '<p class="muted">Lifted, effective today: ' +
        lifted.map((t) => escapeHtml(LABEL[t])).join(", ") +
        ". It has always been permitted.</p>"
    : "";

  const intro = day === 1
    ? '<p>Pick up the <b>marker</b>, black out any words that break the orders below, then <b>file</b> the document. A clean letter, you simply file untouched.</p>' +
      '<p class="muted">Some letters are true. The rules will still demand you bury them. You may instead let one pass — it will cost you, but the tunnels are listening.</p>'
    : "";

  viewEl.innerHTML =
    '<div class="screen">' +
      "<h2>Day " + day + "</h2>" +
      '<p class="muted">Standing Orders for today:</p>' +
      '<div class="orders">' + orders + "</div>" +
      liftedNote +
      intro +
      '<button id="btn-begin">Report for Duty</button>' +
    "</div>";
  byId("btn-begin").addEventListener("click", renderLetter);
}

/** Draw the letter currently on the desk. Rebuilds the whole play frame so the
 *  marker state and meters stay in sync with almost no bookkeeping. */
function renderLetter(): void {
  locked = false;
  painting = false;
  currentLetter = dayQueue[queuePos];
  currentTokens = tokenize(currentLetter);

  const session = Math.floor(queuePos / LETTERS_PER_SESSION) + 1;
  const inSession = (queuePos % LETTERS_PER_SESSION) + 1;
  statusEl.textContent =
    "Day " + day + " · Session " + session + "/" + SESSIONS_PER_DAY +
    " · Letter " + inSession + "/" + LETTERS_PER_SESSION;

  const rationsLow = rations <= 2 ? " low" : "";
  const meters =
    '<div id="meters">' +
      '<div class="meter"><span class="meter-label">Rations</span><br>' +
        '<span class="bar rations' + rationsLow + '">' + bar(rations, RATIONS_MAX) + "</span>" +
        '<span class="num">' + rations + "/" + RATIONS_MAX + "</span></div>" +
      '<div class="meter"><span class="meter-label">Resistance</span><br>' +
        '<span class="bar resist">' + bar(resistance, RESISTANCE_WIN) + "</span>" +
        '<span class="num">' + resistance + "/" + RESISTANCE_WIN + "</span></div>" +
      '<div class="meter"><span class="meter-label">Time on Desk</span><br>' +
        '<span class="bar clock" id="clock">0:00</span></div>' +
    "</div>";

  const rules =
    '<aside id="rulebook"><h2>Standing Orders</h2><ol id="rules">' +
      forbidden.map((t) =>
        '<li class="' + (prevForbidden.includes(t) ? "" : "new") + '">' +
          escapeHtml(RULE_TEXT[t]) + "</li>").join("") +
    '</ol><div class="rule-hint">Marker down → drag across words to black them out. File clean to approve.</div></aside>';

  // Join tokens with spaces, but never put a space before pure punctuation
  // (so a phrase followed by ". " reads "border." not "border . ").
  const bodyHtml = currentTokens.map((t, i) => {
    const lead = (i > 0 && !/^[.,;:!?)\]}'"—]/.test(t.word)) ? " " : "";
    return lead + '<span class="tok" data-i="' + i + '">' + escapeHtml(t.word) + "</span>";
  }).join("");

  const docBlock =
    "<div>" +
      '<div id="doc-wrap">' +
        '<div id="doc" class="' + (markerActive ? "marking" : "") + '">' +
          '<div class="doc-meta">From: ' + escapeHtml(currentLetter.from) +
            " &nbsp;|&nbsp; Re: " + escapeHtml(currentLetter.subject) + "</div>" +
          '<div class="doc-body">' + bodyHtml + "</div>" +
        "</div>" +
        '<div id="stamp"></div>' +
      "</div>" +
      '<div id="tools">' +
        '<button id="btn-marker" class="' + (markerActive ? "active" : "") + '">' +
          "🖊 Marker: " + (markerActive ? "Down" : "Up") + "</button>" +
        '<button id="btn-clear">Clear marks</button>' +
      "</div>" +
      '<div id="choices"><button id="btn-file">File Document</button></div>' +
      '<div id="feedback"></div>' +
    "</div>";

  viewEl.innerHTML = meters + '<div id="cols">' + rules + docBlock + "</div>";

  wireDesk();
  startClock();
}

/* ---------- THE DESK CLOCK ----------
   Every letter gets a countdown that scales with its length. Let it hit zero
   and the supervisor seizes the unstamped document — a mistake, and a ration. */
function startClock(): void {
  timeLeft = Math.max(8, Math.round(TIME_BASE + currentTokens.length * TIME_PER_WORD));
  updateClock();
  stopClock();
  clockInterval = window.setInterval(() => {
    timeLeft--;
    updateClock();
    if (timeLeft <= 0) { stopClock(); handleTimeout(); }
  }, 1000);
}

function stopClock(): void {
  if (clockInterval !== null) { clearInterval(clockInterval); clockInterval = null; }
}

function updateClock(): void {
  const el = document.getElementById("clock");
  if (!el) return;
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  el.textContent = m + ":" + String(s).padStart(2, "0");
  el.classList.toggle("low", timeLeft <= 6);
}

/** Ran out of time before filing. */
function handleTimeout(): void {
  if (locked) return;
  locked = true;
  stopClock();
  sessionMistakes++;
  rations = Math.max(0, rations - 1);
  showStamp("SEIZED", "var(--stamp)");
  const fb = byId("feedback");
  fb.className = "bad";
  fb.textContent = "TIME UP — the supervisor lifted the document from your hands. An unstamped desk is a suspicious desk.";
  byId<HTMLButtonElement>("btn-file").disabled = true;
  byId<HTMLButtonElement>("btn-clear").disabled = true;
  window.setTimeout(afterVerdict, 1700);
}

/** Attach the marker, clear, and file controls for the current letter. */
function wireDesk(): void {
  const doc = byId("doc");

  byId("btn-marker").addEventListener("click", () => {
    markerActive = !markerActive;
    const b = byId("btn-marker");
    b.textContent = "🖊 Marker: " + (markerActive ? "Down" : "Up");
    b.classList.toggle("active", markerActive);
    doc.classList.toggle("marking", markerActive);
  });

  byId("btn-clear").addEventListener("click", () => {
    if (locked) return;
    currentTokens.forEach((t, i) => {
      if (t.blacked) { t.blacked = false; setTokEl(i, false); }
    });
  });

  byId("btn-file").addEventListener("click", fileDocument);

  // Marker painting: click to toggle one word, drag to paint a run.
  doc.addEventListener("pointerdown", (e) => {
    if (!markerActive || locked) return;
    const target = e.target as HTMLElement | null;
    const span = target ? target.closest<HTMLElement>(".tok") : null;
    if (!span) return;
    e.preventDefault();
    const i = Number(span.dataset.i);
    currentTokens[i].blacked = !currentTokens[i].blacked;
    setTokEl(i, currentTokens[i].blacked);
    painting = true;
    paintState = currentTokens[i].blacked;
  });

  doc.addEventListener("pointermove", (e) => {
    if (!painting || locked) return;
    const under = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    if (under && under.classList.contains("tok")) {
      const i = Number(under.dataset.i);
      if (currentTokens[i].blacked !== paintState) {
        currentTokens[i].blacked = paintState;
        setTokEl(i, paintState);
      }
    }
  });
}

window.addEventListener("pointerup", () => { painting = false; });

/** Toggle the blacked-out class on the DOM span for token `i`. */
function setTokEl(i: number, on: boolean): void {
  const el = document.querySelector('.tok[data-i="' + i + '"]');
  if (el) el.classList.toggle("blacked", on);
}

/* ---------- THE VERDICT ---------- */
function fileDocument(): void {
  if (locked) return;
  locked = true;
  stopClock();

  // Which words SHOULD be redacted today, and which the player actually blacked.
  const required = new Set<number>();
  const blacked = new Set<number>();
  currentTokens.forEach((t, i) => {
    if (t.topic && forbidden.includes(t.topic)) required.add(i);
    if (t.blacked) blacked.add(i);
  });
  let missed = 0;
  let excess = 0;
  required.forEach((i) => { if (!blacked.has(i)) missed++; });
  blacked.forEach((i) => { if (!required.has(i)) excess++; });

  const fb = byId("feedback");
  let stampText: string;
  let stampColor: string;
  let fbClass: string;
  let fbText: string;
  let rationDelta = 0;
  let resistDelta = 0;
  let mistake = false;

  if (required.size > 0 && blacked.size === 0) {
    // The player let banned content pass untouched.
    if (currentLetter.conscience) {
      stampText = "RELEASED"; stampColor = "var(--amber)"; fbClass = "defy";
      fbText = "You let it pass. If they trace the ink to your desk, this costs you — but the truth is loose now, and the tunnels will hear of it.";
      rationDelta = -1; resistDelta = 1; released++;
    } else {
      stampText = "FLAGGED"; stampColor = "var(--stamp)"; fbClass = "bad"; mistake = true;
      const brokenTopic = currentTokens[[...required][0]].topic as TopicKey;
      fbText = "CITIZEN REPORTED — banned material left your desk unredacted. It mentioned " +
        LABEL[brokenTopic] + ". The Ministry noticed.";
      rationDelta = -1;
    }
  } else if (missed === 0 && excess === 0) {
    // A clean, exact filing.
    if (required.size === 0) {
      stampText = "FILED"; stampColor = "#3f5a33"; fbClass = "good";
      fbText = "Approved. Nothing here offends the State today.";
    } else if (currentLetter.conscience) {
      // Burying a truth: the regime rewards you with a ration, but the cause
      // loses ground. The exact mirror of letting one pass.
      stampText = "FILED"; stampColor = "#3f5a33"; fbClass = "guilt";
      fbText = "You blacked it out. A true thing stops here — the regime stamps your ration book, and the tunnels grow one voice quieter.";
      rationDelta = 1; resistDelta = -1; buried++;
    } else {
      stampText = "FILED"; stampColor = "#3f5a33"; fbClass = "good";
      fbText = "Filed without comment. The words are gone; so is whatever they meant.";
    }
  } else if (missed > 0) {
    stampText = "FLAGGED"; stampColor = "var(--stamp)"; fbClass = "bad"; mistake = true;
    fbText = "CITIZEN REPORTED — you missed a word. A single word is enough to hang a district.";
    rationDelta = -1;
  } else {
    stampText = "FLAGGED"; stampColor = "var(--stamp)"; fbClass = "bad"; mistake = true;
    fbText = "CITIZEN REPORTED — you blacked out words that broke no order. Ink is rationed too.";
    rationDelta = -1;
  }

  if (mistake) sessionMistakes++;

  // Apply consequences. Resistance floors at 0; rations cap at max / floor at 0.
  resistance = Math.max(0, resistance + resistDelta);
  rations = Math.max(0, Math.min(RATIONS_MAX, rations + rationDelta));

  showStamp(stampText, stampColor);
  fb.className = fbClass;
  fb.textContent = fbText;
  byId<HTMLButtonElement>("btn-file").disabled = true;
  byId<HTMLButtonElement>("btn-clear").disabled = true;

  window.setTimeout(afterVerdict, 1700);
}

function afterVerdict(): void {
  // Win / lose checks first.
  if (resistance >= RESISTANCE_WIN) { victory(); return; }
  if (rations <= 0) { gameOver(); return; }

  queuePos++;

  // End of a session?
  if (queuePos % LETTERS_PER_SESSION === 0) {
    if (sessionMistakes === 0 && rations < RATIONS_MAX) {
      rations = Math.min(RATIONS_MAX, rations + 1); // quota met: a small reward
    }
    const flawless = sessionMistakes === 0;
    sessionMistakes = 0;

    if (queuePos >= LETTERS_PER_DAY) { startDay(); return; }  // new day briefing
    renderInterstitial(flawless);
    return;
  }

  renderLetter();
}

/** A short breather between sessions. */
function renderInterstitial(flawless: boolean): void {
  statusEl.textContent = "";
  const nextSession = Math.floor(queuePos / LETTERS_PER_SESSION) + 1;
  const note = flawless
    ? "Quota met without error. One ration restored. Your supervisor almost smiles."
    : "The session is logged. Report back to your desk.";
  viewEl.innerHTML =
    '<div class="screen">' +
      "<h2>Session Complete</h2>" +
      '<p class="muted">' + note + "</p>" +
      "<p>Rations: " + rations + "/" + RATIONS_MAX +
        " &nbsp;·&nbsp; Resistance: " + resistance + "/" + RESISTANCE_WIN + "</p>" +
      '<button id="btn-next">Begin Session ' + nextSession + "</button>" +
    "</div>";
  byId("btn-next").addEventListener("click", renderLetter);
}

/** Slam a stamp down on the document. */
function showStamp(text: string, color: string): void {
  const stamp = byId("stamp");
  stamp.textContent = text;
  stamp.style.color = color;
  stamp.style.borderColor = color;
  stamp.classList.remove("show");
  void stamp.offsetWidth;   // restart the animation
  stamp.classList.add("show");
}

/* ---------- ENDINGS ---------- */
function gameOver(): void {
  statusEl.textContent = "";
  viewEl.innerHTML =
    '<div class="screen">' +
      '<h2 class="red">Ration Book Void</h2>' +
      "<p>The stamps in your book have run out. On the " + ordinal(day) +
        " day, the desk behind you is already being cleared for someone more careful.</p>" +
      '<p class="muted">' + buried + " truths buried · " + released +
        " truths released · Resistance reached " + resistance + "/" + RESISTANCE_WIN + ".</p>" +
      '<button id="btn-restart">Report for Duty</button>' +
    "</div>";
  byId("btn-restart").addEventListener("click", startGame);
}

function victory(): void {
  statusEl.textContent = "";
  viewEl.innerHTML =
    '<div class="screen">' +
      '<h2 class="amber">The Uprising</h2>' +
      "<p>Enough truth reached the tunnels. On the " + ordinal(day) +
        " day the presses you were meant to silence print something the Ministry cannot recall. " +
        "The Eastern Sector has always been loyal — to itself.</p>" +
      '<p class="muted">' + released + " truths released · " + buried +
        " buried along the way. History will disagree about which mattered.</p>" +
      '<button id="btn-restart">Begin Again</button>' +
    "</div>";
  byId("btn-restart").addEventListener("click", startGame);
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/* ---------- INTRO ---------- */
function renderIntro(): void {
  statusEl.textContent = "";
  viewEl.innerHTML =
    '<div class="screen">' +
      "<h2>Ministry of Truth</h2>" +
      "<p>You are a clerk of the Ministry. On paper, you are loyal. In truth you carry a second name, " +
        "whispered in the tunnels beneath District 9.</p>" +
      "<p>Every letter that crosses your desk is a life the regime wants edited. Black out the forbidden " +
        "words to keep your ration book stamped and your family fed — or let the truth pass, and feed " +
        "something hungrier than any of you.</p>" +
      '<p class="muted">The marker keeps you alive. The truth keeps you human. You will not often afford both.</p>' +
      '<button id="btn-start">Report for Duty</button>' +
    "</div>";
  byId("btn-start").addEventListener("click", startGame);
}

renderIntro();
