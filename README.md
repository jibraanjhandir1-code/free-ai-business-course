# Free AI Business Course

Static course site: plain HTML lesson pages, one stylesheet, one small script, one self-hosted font. No build step, no LMS, no third-party requests. It deploys to GitHub Pages or Vercel with zero config, and also works straight from the folder (`file://`).

## Structure

```
index.html                     Course map: the route, all 8 modules, progress, your notes
404.html                       "That page isn't here", for GitHub Pages
modules/
  module-0/0.1-day-1-publish-something.html
  ...
  module-7/7.4-what-happens-after-client-1.html
assets/
  css/archivo.css              The font's @font-face rules, with the latin subset inlined (generated)
  css/style.css                Every other style on the site (tokens at the top)
  js/course.js                 Course outline, progress, notes, fill-ins, rail
  fonts/                       Archivo (variable woff2) and its licence, OFL.txt
  og-image.png                 1200×630 link-preview image
```

## What learners can do

Every page is complete without JavaScript. `course.js` adds:

- **Fill in the blanks.** Every prompt and script has a **Fill in blanks** button. The `[BRACKETED]` parts become labelled fields; the text updates as you type, and **Copy** copies exactly what's on screen. `[NICHE]` fills in across the whole course; other named blanks are shared within a lesson (fill `[OWNER NAME]` once for all of 5.2's scripts); generic ones like `[X]` and `[PASTE]` are filled one at a time and labelled by the sentence they sit in. Click any highlighted blank to jump to its field.
- **Your notes.** Each lesson has a notes box under "What you should have when this lesson is done", for the link, number or answer the lesson asks for. Notes save as you type and collect on the course map under **Your notes**, with **Download your notes** (a .txt file).
- **Mark this lesson as done.** Ticks show on the course map, in the lesson rail, and in the route ("How the whole thing fits together"), which fills in as modules are finished.
- **Continue.** The course map's main button goes to the lesson after the furthest one ticked. When all 36 are done it points back to 5.1, because 7.4 says the course loops from there.
- **Find your place.** On wide screens a rail shows the module's lessons and the rest of the course; on phones and tablets the same list sits under each lesson.

Everything is saved in the learner's browser (localStorage), not on a server, so it doesn't follow someone to another device. **Clear everything** in the course map's footer wipes ticks, notes and fill-ins (it asks twice).

## Adding a new lesson

1. Copy an existing lesson file in the same module folder.
2. Update `<title>`, the `description` and `og:` meta tags, `data-lesson` on `<body>`, the crumb ("Lesson N of M"), the `<h1>` (number and title), `.lesson-desc`, the "Before you start" list, the body, and the previous/next links at the bottom. Fix the previous/next links on the neighbouring lessons too.
3. Add a row for it in `index.html` (inside that module's `<ol class="lesson-list">`, plus a `<span class="tally-mark" data-lesson="…">` in the tally).
4. Add it to the `COURSE` outline near the top of `assets/js/course.js`, so the rail, ticks and progress count include it.

Lesson numbers written in the text ("from 3.4", "go do 3.1 first") are links to that lesson. Link new references the same way.

## Lesson building blocks

The stylesheet styles these blocks inside `.lesson-body`:

| Block | Markup | Use it for |
| --- | --- | --- |
| Prompt or script | `.prompt-block` > `.prompt-head` (name `<span>`, `.copy-hint`) + `<pre>` | Exact text to paste. Put anything the learner fills in inside `[SQUARE BRACKETS]`; it becomes a fill-in field. `[LABEL, e.g. example]` shows the example as a hint. |
| Base44 step | `.callout` > `.callout-label` | Something to do in the builder right now. |
| Today's build (Module 0) | `.daily-build` > `.daily-label` (with `.daily-time`) | The day's single build. |
| Done when | `.deliverable` > `.deliverable-label` | What the learner should have at the end. The notes box and the "Mark this lesson as done" checkbox attach to the last one. |

To make another blank fill in across the whole course (like `[NICHE]`), add it to `COURSE_WIDE_BLANKS` in `course.js`.

## Videos

Every lesson has a video slot that stays hidden while its iframe `src` is `about:blank`. To add a video, set that `src` to the embed URL (YouTube, Loom, Vimeo) and it appears between "Before you start" and the lesson text.

## Design

- **Type:** Archivo, self-hosted under the SIL Open Font License. It's used across its width axis: expanded and heavy for titles and numbers, normal width for reading. The latin subset is inlined in `assets/css/archivo.css`, so every page's first frame is already in Archivo instead of a fallback font that then swaps; that file is generated from `assets/fonts/archivo-latin.woff2`, so don't edit it by hand.
- **Moving between lessons:** pages fade into each other (a cross-document view transition, off for people who ask for reduced motion), and `course.js` is render-blocking, so the lesson rail and the other extras are there in the first frame rather than popping in.
- **Colour:** white paper, black type, and two inks. Ballpoint blue (`--ink`) for links, buttons and finished lessons; a pale blue wash (`--marker`) for blanks still to fill in and "you are here". Dark mode follows the reader's system setting.
- All tokens are CSS custom properties at the top of `assets/css/style.css`.

## Deploying

No build step. Push to GitHub; GitHub Pages (or Vercel) serves the files as they are and redeploys on every push to `main`. The link-preview tags point at `https://zamanjha.github.io/free-ai-business-course/`; change that address in each page's `og:` tags if the site moves.
