# SpellQuest — AI-enabled Version

This project is your SpellQuest game with AI integrated, **without changing the core UI layout**.

## What AI features are added?

1. **AI-powered smart hints**
   - When you click **"Show Hint"**, the frontend calls `POST /api/hint`.
   - The Node.js server (`server.js`) sends the word to OpenAI's Chat Completions API.
   - The model returns a **short, kid-friendly sentence hint**, which is shown under the picture.

2. **Adaptive word selection (simple AI/ML logic on device)**
   - For each word, the game tracks:
     - how many times it was attempted
     - how many times it was correct
   - This data is saved in `localStorage` as `spellquest_stats`.
   - The next word is chosen with a small algorithm that prefers words where accuracy is lower (the player struggles more).
   - This makes practice more personalized and is a simple form of on-device learning.

## Files

- `index.html`  
  Your game UI + JavaScript logic with:
    - AI hint fetch (`/api/hint`)
    - adaptive selection using `localStorage` stats

- `server.js`  
  Node/Express server that:
    - exposes `POST /api/hint`
    - calls OpenAI Chat Completions API
    - returns `{ hint: "..." }` to the frontend

- `package.json`  
  Node project config & dependencies.

- `README.md`  
  This description.

- `.gitignore`  
  Ignores `node_modules` and `.env`.

- `images/` (empty)  
  Put your PNGs here, e.g. `cat.png`, `dog.png`, etc.

## How to run

1. Install Node.js (v16+ recommended).
2. Open a terminal in this folder (`SpellQuest-AI/`).
3. Install dependencies:

   ```bash
   npm install
   ```

4. Set your OpenAI API key and start the server:

   **Linux / macOS (bash):**
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   npm start
   ```

   **Windows (PowerShell):**
   ```powershell
   $env:OPENAI_API_KEY="your_api_key_here"
   npm start
   ```

5. Open `index.html` in your browser:
   - Either double-click it (file:// URL)
   - Or serve this folder statically with any simple HTTP server.

   The AI hint calls go to `http://localhost:3001/api/hint` (same origin if served from the server).

## Images

- Create / use PNG files that match the names used in `index.html`, example:
  - `images/cat.png`
  - `images/dog.png`
  - `images/sun.png`
- If an image is missing locally, the code automatically falls back to a CDN icon.

## Important

- **Never** put your OpenAI API key inside `index.html` (frontend). Keep it only as an environment variable on the server side.
- This is a minimal educational example, not production-hardened (no auth, rate limit, etc.).
