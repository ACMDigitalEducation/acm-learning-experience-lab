# ACM Learning Experience Lab

A standalone, responsive React/Vite study for evaluating Canvas navigation. Six design combinations are represented by three interactive navigation patterns and two visual treatments. The study deliberately separates task testing (all in the simple visual treatment) from visual preference comparison to reduce confounding.

## What participants experience

1. Introduction, voluntary participation information, and consent.
2. Nine guided tasks (three tasks across each of three navigation patterns), in randomised layout order. Participants can find the activity, restart the task, or give up. Activity click errors, success, and elapsed time are captured. The mock course content is the same throughout.
3. Interactive comparison of simple and visual treatments (accordion example).
4. Navigation preference, visual preference, 1–5 ease rating, and optional comments.
5. Submission and a downloadable JSON backup.

No Canvas login, real course content, student names, emails or IDs are collected. The response includes a random browser-session ID, device category and task data. This is **formative research**, not a controlled experiment. Note: the visual preference stage only compares the two treatments on the accordion layout, rather than presenting all six combinations individually.

## Run locally

Requires Node.js 20.19+ (or Node 22.12+).

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local address printed by Vite. Without an endpoint, participants can test the site, but feedback is **not submitted anywhere**; the final page offers a JSON download.

## Connect a Google Sheet

1. Create a dedicated Google Sheet in an ACM-approved account. Do not use a personal Google account for institutional student research.
2. Open **Extensions → Apps Script** and replace the editor content with `backend/Code.gs`.
3. In Apps Script, open **Project Settings → Script properties**, add `SHEET_ID` with the ID from the Google Sheet URL (the segment between `/d/` and `/edit`). For a sheet-bound script this is optional.
4. Choose **Deploy → New deployment → Web app**. Execute as **Me**. Access: **Anyone** (only if ACM approves public anonymous collection). Authorise and copy the deployment URL ending in `/exec`.
5. Copy `.env.example` to `.env` and set `VITE_FEEDBACK_ENDPOINT=https://script.google.com/macros/s/.../exec`. Optionally set `VITE_PRIVACY_CONTACT=...`.
6. Restart the Vite dev server, test with a complete sample submission, and verify **nine new rows** appear in the `Responses` tab. Delete the test rows before sharing.

**Important limitation:** Apps Script's cross-origin response is opaque to the browser. The interface cannot verify successful receipt, even if the network request completes. Participants are told this and offered a JSON backup. Check the Sheet after a test submission before sharing. For production-grade confirmed delivery, replace Apps Script with a CORS-enabled endpoint that returns an explicit acknowledgement. Public endpoints may receive spam or duplicate submissions; review data before analysis.

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `acm-learning-experience-lab`) and push this folder's contents. Do **not** commit `.env`; it is ignored.
2. In repository **Settings → Secrets and variables → Actions**, add repository variable `VITE_FEEDBACK_ENDPOINT` with the deployed Apps Script URL. Optionally add `VITE_PRIVACY_CONTACT`.
3. In **Settings → Pages**, set **Source** to **GitHub Actions**.
4. Push to `main`. The included workflow builds and deploys automatically. The published URL will be `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.
5. Open the published site on desktop and mobile and submit a test response. Confirm rows in Google Sheets.

The deployment URL is part of the client-side JavaScript and **is not a secret**. Do not put passwords or API keys in Vite environment variables.

## Research / governance notes

- Obtain ACM approval for the participant information, data retention period, external hosting, and any required accessibility/privacy review before inviting students.
- This prototype is a simplified Canvas-like interface, not an authenticated Canvas instance; findings should be validated in real Canvas before changes are made.
- The study records interaction performance on twelve tasks. It does not automatically measure task success for every possible interaction.
- The current-week layout requires the participant to open **Browse all teaching weeks** to access non-current weeks, intentionally reflecting that pattern's discoverability cost.
- The mock completion control is illustrative only and does not write to Canvas.
- The UI does not track IP addresses, cookies, analytics or account identifiers in its own code. GitHub and Google may separately process service logs under their policies.
- The site does not automatically save in-progress data. Closing the page before submission loses the response.
- If the backend is not configured or the network fails, the user can download JSON. Avoid presenting an unverified submission as a confirmed success.

## Interpreting the results

The `Responses` sheet contains **one row per task**, so each respondent generates nine rows. Use distinct `responseId` counts for participant totals; calculate task success rate, median time (including only successes when appropriate), and error clicks by layout. For navigation/style preference, count distinct `responseId` values rather than counting all nine rows. Counterbalance is handled by randomising the three layout orders.


## Version 1.1: Week tiles

Added a fourth, substantially different navigation approach: a large, responsive grid of six week tiles. Each tile opens its week activities, with a prominent back-to-all-weeks control. The same three tasks are used across all four navigation methods (12 task attempts per participant), and the new option appears in the final navigation preference question. The navigation test order remains randomised. Allow approximately 10–15 minutes for the study.

### Version 4 usability changes
- Every navigation layout begins with its own introduction screen, including the first.
- Each participant sees 12 distinct activity targets (three per layout), with a randomised starting offset. Target difficulty is not formally equated; interpret raw speed comparisons cautiously.
- Task instructions are visually prominent, and the page scrolls to the top when moving between tasks or screens.
- Timing starts only when the participant starts a layout; restarting a task resets its timer.
