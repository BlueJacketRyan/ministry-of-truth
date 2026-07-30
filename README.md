# Ministry of Truth

A dystopian document-redaction game. You are a censor at the Ministry — loyal on
paper, but secretly with the resistance. Letters cross your desk; black out the
words that break the day's Standing Orders and file them, or let a dangerous
truth pass and feed the uprising.

It is a single, self-contained HTML file — no build step, no dependencies.

## Play it

You need [Node.js](https://nodejs.org) installed. Then, from this folder:

```bash
npm run dev
```

This starts a local server at <http://localhost:5173/> and opens the game in your
browser. Press `Ctrl+C` to stop it. (Change the port with `PORT=3000 npm run dev`.)

You can also just open `ministry-of-truth.html` directly in a browser — the game
runs entirely client-side.

## How it plays

- **Read each letter** and compare it to today's Standing Orders.
- **Pick up the marker** and drag across the words that break a rule to black
  them out, then **File** the document. A clean letter, you file untouched.
- **Rations** are your survival — every mistake costs one; a flawless session
  earns one back. Reach zero and your family starves.
- **Resistance** is the cause. Some letters are true and human: bury one and the
  regime rewards you with a ration, but the cause loses ground; let one pass and
  you sacrifice a ration to feed the Resistance. Fill the meter and the uprising
  comes.
- **Time on Desk** is a countdown per letter. Let it hit zero and the supervisor
  seizes the document — a mistake, and a ration.

The forbidden topics rotate and escalate each day, so the game runs indefinitely.

## Structure

- `ministry-of-truth.html` — the entire game (markup, styles, and logic)
- `server.js` — a zero-dependency static dev server
- `package.json` — the `npm run dev` script
