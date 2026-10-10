# পাতার পর পাতা · Bangla Literature

A static bilingual learning library for the 30 supplied literature lectures: 44 complete twelve-card sequences (38 narrative works and six poem journeys), 77 author guides, an eight-part timeline and 132 recall questions. Bengali, English and side-by-side reading are available. Endings are included.

## Preview

Open `index.html` for a basic preview. For installation and offline caching, serve this directory:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://localhost:8765/` in Chrome. Wait for **Offline ready** before disconnecting. All stories and illustrations are cached together, including ones you have not opened yet. The Bengali font is also cached. External references need internet.

## Publish on GitHub Pages

1. Extract `bangla-literature-github-pages.zip`. Upload its **contents** to a repository, with `index.html` at the repository root.
   The ZIP is a delivery container, not the website entry point. Upload the extracted files rather than the ZIP or original lecture folder. This runtime-only package excludes the Word document, Python scripts, development tools, lecture scans and QA files. Every extracted file is below GitHub's 25 MiB browser upload limit.
2. Commit the files before pushing. The original lecture PDFs and OCR files are deliberately excluded from this publishing package.
3. In GitHub, open **Settings → Pages**. Select **Deploy from a branch**, choose your branch (usually `main`) and **/(root)**, then save.
4. Open the HTTPS Pages address after deployment. A project address such as `https://YOUR-NAME.github.io/YOUR-REPOSITORY/` is supported; all app paths are relative.
5. Check the timeline, a story and the **Offline ready** indicator. Reopen with the network disabled. Use the top **Install app** button in Chrome. If Chrome does not supply a prompt, the button explains the browser menu route.

No server, API key, npm build, database or paid service is required. The repository contains the generated static web app. Development sources and the Word companion remain in the original local workspace.

## Reading controls

- Search Bengali or English titles, authors, characters and themes. Filters combine with the selected period.
- Click anywhere on a story card to open it. Save using the heart; choose **Saved stories** to see your shelf.
- The reader supports Previous/Next, arrow keys, numbered card jumps and Escape to close. On touchscreens, swipe left for the next scene and right for the previous one; vertical scrolling and pinch zoom remain available. Continue appears only for stories started but not completed; every story opens by clicking its card or keyboard-accessible title.
- Progress counts distinct cards opened, not time spent reading. Returning resumes the last card. **Unread** means no cards opened.
- Each work has three questions with explanations. Best scores persist in this browser.
- The Install app control is shown in an ordinary browser and hidden when launched as an installed app or after installation. Returning from an app window to browser mode updates the control.
- Export/import progress transfers a JSON backup between browsers. Import merges saved works, reading progress and best scores. No information is uploaded.

## Content and companion document

The lecture map covers 18 scanned PDF files / 582 pages. The app is a curated guide, not an exhaustive transcription of every lecture fact or exam question. Author guides list additional works without promising a twelve-card retelling for every listed title. Poetry cards explain images and ideas without inventing a plot.

In the local development workspace, `content/catalog.json` and `content.js` are generated together from `tools/build_content.py` and the hand-authored `content/stories_*.py` files. The local `content/narration-revisions.json` supplies reviewed narration edits; the first two cards of every work set a concrete scene and establish forward momentum. The local `Bangla Literature Companion.docx` contains the same timeline, author lists, cards, cast, quizzes and source notes. The published site uses `content.js` and excludes the Word document and Python sources.

See `content/research-log.md` for verification scope, corrections and lecture coverage. Primary texts, university materials, Banglapedia, library records and author interviews serve different purposes; publication metadata is not treated as proof of a plot.

## Regenerate after editing

These commands apply to the original development workspace. Build scripts and Python dependencies are kept there and excluded from the publishing ZIP. GitHub Pages runs the generated HTML, CSS and JavaScript directly; it does not need Python. Keep the manifest, service worker, icons, font and source-note files alongside the app because its install and offline features reference them.

```powershell
python -m pip install -r requirements.txt
python tools/build_content.py
python tools/build_document.py
python tools/build_release.py
```

Icons are already included. For optional development checks, install Node.js and run `npm install --no-save sharp playwright`. `node tools/build_assets.cjs` rebuilds the icons; run it before the content and release generators. With Chrome installed and the preview server running, `node tools/check_site.cjs` checks the app. Its default URL is `http://localhost:8765/literature/`, served by `node tools/serve_preview.cjs`. Set `TEST_URL` for another address. `SHARP_MODULE` and `PLAYWRIGHT_MODULE` can point to an existing dependency installation. These are development tools; the published app has no Node dependency.

Regenerate the release whenever content or UI changes. The service-worker cache version fingerprints content, UI, icons, font, manifest and the document generator. During updates, close all old app tabs and reopen to allow the new worker to activate. Browser storage can be cleared by browser settings; export important progress first. Progress is local to each origin and browser.

## Files and licenses

- `index.html`, `styles.css`, `app.js`, `content.js`: static app.
- `manifest.webmanifest`, `sw.js`, `assets/`: installable offline app assets.
- Bengali font: Noto Sans Bengali, SIL Open Font License; see `assets/OFL.txt`.
- Summaries and Bengali explanations are original paraphrases. No copyrighted book scans are in the deployment ZIP. Storybook artwork in `assets/illustrations/` is generated with the built-in image tool. Each work has one four-column, three-row atlas; the app displays its twelve scenes separately. Character identity, complexion, hair, build and clothing remain consistent within a work, with story-supported changes. These images are interpretations rather than authenticated historical portraits.
- `content/illustration-prompts.json` records the final prompts, continuity bibles and bilingual appearance notes. Explicitly checked textual descriptions have edition links; unverified skin palettes, facial geometry and costume colours are labelled artistic choices. Complexion is never a judgement of virtue or worth. The Word companion includes the same twelve-scene overview and appearance notes.
- To maintain artwork, edit `tools/build_visual_prompts.py`, then regenerate the prompt set. Generate new illustrations with the built-in image tool and record local output paths in the private QA ledger. `node tools/prepare_illustrations.cjs` compresses the finished images for web and Word use. Regenerate content, Word and release after replacing assets. The service-worker fingerprint includes every nested illustration and caches them for offline reading.
- External source websites and original literary works retain their respective rights. Full texts should be consulted through the linked editions.
