# পাতার পর পাতা · Bangla Literature

A static bilingual learning library for the 30 supplied literature lectures: 44 complete twelve-card sequences (38 narrative works and six poem journeys), 77 author guides, an eight-part timeline and 132 recall questions. Bengali, English and side-by-side reading are available. Endings are included.

## Preview

Open `index.html` for a basic preview. For installation and offline caching, serve this directory:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://localhost:8765/` in Chrome. Wait for **Offline ready** before disconnecting. All stories and illustrations are cached together, including ones you have not opened yet. The Bengali font is also cached. External references need internet.

## Publish on GitHub Pages

1. Upload the **contents of `02-GitHub-Pages`** to the repository, with `index.html` at the repository root. Do not nest that folder inside the repository.
   The local delivery has exactly two folders and one APK: `01-Reproduce` holds private editable sources, lectures, Word, QA and build tools; `02-GitHub-Pages` holds this complete static website; `Bangla-Literature.apk` installs the offline Android reader. Only the website folder belongs in this public repository. Git's hidden `.git` directory is local repository metadata and is never uploaded as website content. Each public file is below GitHub's 25 MiB browser upload limit.
2. Commit the files before pushing. The original lecture PDFs and OCR files are deliberately excluded from this publishing package.
3. In GitHub, open **Settings → Pages**. Select **Deploy from a branch**, choose your branch (usually `main`) and **/(root)**, then save.
4. Open the HTTPS Pages address after deployment. A project address such as `https://YOUR-NAME.github.io/YOUR-REPOSITORY/` is supported; all app paths are relative.
5. Check the timeline, a story and the **Offline ready** indicator. Reopen with the network disabled. Use the top **Install app** button in Chrome. If Chrome does not supply a prompt, the button explains the browser menu route.

No server, API key, npm build, database or paid service is required. The repository contains the generated static web app. Development sources and the Word companion remain in the private `01-Reproduce` folder.

## Android APK

The local `Bangla-Literature.apk` is one signed universal installer for phones and tablets running Android 9 or newer with an up-to-date Android System WebView. It includes all 44 stories, pictures, author portraits and 528 English recordings, so no initial narration download is needed. Copy it to the device, open it and allow installation from the app used to open the file when Android requests it. The APK is a local deliverable, not part of the GitHub Pages repository.

In the Android reader, **Clear temporary cache** preserves the bundled library and reading progress. Uninstall the Android app to remove its packaged library and recordings. Export progress first: Android installation and the browser website have separate storage, and this app does not synchronize devices automatically. Import the JSON backup into the other app/browser to merge progress. Source links open externally in the browser. Content updates require installing a newer APK signed with the same private project key.

## Reading controls

- Search Bengali or English titles, authors, characters and themes. Filters combine with the selected period.
- Click anywhere on a story card to open it. Save using the heart; choose **Saved stories** to see your shelf.
- The reader supports Previous/Next, arrow keys, numbered card jumps and Escape to close. On touchscreens, swipe left for the next scene and right for the previous one; vertical scrolling and pinch zoom remain available. Continue appears only for stories started but not completed; every story opens by clicking its card or keyboard-accessible title.
- Progress counts distinct cards opened, not time spent reading. Returning resumes the last card. **Unread** means no cards opened.
- Each work has three questions with explanations. Best scores persist in this browser.
- One compact **English narration** player sits below the story cards. **Play story** begins at card one; **Play from here** starts at the current card and continues to the end. The player reads only the English story text, omitting card titles. Pause/Resume and Stop share the same two controls; a whole-story seek bar appears during playback. The options menu (⋯) contains playback pace and offline audio saving. Cards turn after a brief pause, and narration stops after card twelve. Changing cards manually, switching tabs or closing stops playback; hiding the app pauses it. Opening a story never starts audio automatically.
- The home screen offers **Download all narration** for all 44 stories / 528 recordings. It shows the download size and progress, supports Cancel and Resume, and skips recordings already saved. Use it after installation or in an ordinary browser. Downloads begin only when requested. Completed downloads survive cancellation, reconnects and app updates while their content remains unchanged.
- **Clear downloaded narration** removes saved audio and stops active downloads/playback while keeping the offline reading library. **Clear app cache** removes this app’s offline library and audio and keeps offline saving off across reloads. Service-worker removal is requested without making offline cleanup wait for Chrome’s queued registration jobs. Both preserve your saved stories, reading progress and quiz scores and work in browser and installed app windows. Choose **Enable offline access** when online to restore offline reading, then download narration again if needed. These controls clear this app’s Cache Storage, not the browser’s general HTTP cache, and do not uninstall the app.
- Audio is downloaded as needed and saved after listening. Open the narration options menu (⋯) and use **Save audio offline** to store all twelve recordings for a story. The saved-recording counter confirms how many are saved. The core reading library and portraits are cached separately, so preparing offline reading does not require downloading the full audio collection. Saved audio survives app updates when its content has not changed.
- The **Author** tab immediately before Quiz shows the writer, dates, introduction, major works and a credited portrait. Where no verified reusable portrait was found, a manuscript symbol is explicitly labelled as a symbol rather than a likeness.
- The Install app control is shown in an ordinary browser and hidden when launched as an installed app or after installation. Returning from an app window to browser mode updates the control.
- Export/import progress transfers a JSON backup between browsers. Import merges saved works, reading progress and best scores. No information is uploaded.

## Content and companion document

The lecture map covers 18 scanned PDF files / 582 pages. The app is a curated guide, not an exhaustive transcription of every lecture fact or exam question. Author guides list additional works without promising a twelve-card retelling for every listed title. Poetry cards explain images and ideas without inventing a plot.

In the local development workspace, `content/catalog.json` and `content.js` are generated together from `tools/build_content.py` and the hand-authored `content/stories_*.py` files. The local `content/narration-revisions.json` supplies reviewed narration edits; the first two cards of every work set a concrete scene and establish forward momentum. The local `Bangla Literature Companion.docx` contains the same timeline, author lists, cards, cast, quizzes and source notes. The published site uses `content.js` and excludes the Word document and Python sources.

See `content/research-log.md` for verification scope, corrections and lecture coverage. Primary texts, university materials, Banglapedia, library records and author interviews serve different purposes; publication metadata is not treated as proof of a plot.

## Regenerate after editing

These commands apply inside the private `01-Reproduce` folder. Its `REPRODUCE.md` and `Rebuild.ps1` describe the retained Windows runtimes, website generator and APK build. Build scripts, model weights and the APK signing key are excluded from this public repository. GitHub Pages runs the generated HTML, CSS and JavaScript directly; it does not need Python. Keep the manifest, service worker, icons, font and source-note files alongside the app because its install and offline features reference them.

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
- `voiceover.js`, `assets/audio/`: 528 pre-generated neural English MP3 recordings and the browser audio player. Playback needs no account, API key, speech service or installed English voice. The same recording plays on every device. Audio is generated locally using Kokoro 82M v1.0, `af_heart`, speed 0.92, and encoded as 24 kHz mono MP3 at 64 kbps. See `assets/audio/NOTICE.txt` and `assets/audio/LICENSE-kokoro.txt` for provenance. The local editable manifest is `content/audio-manifest.json`; model weights and generation tools are excluded from publishing.
- `assets/authors/`: 18 sourced portraits and an original CC0 manuscript symbol. Portrait source, creator, license and resizing information appear beneath each image in the Author tab; credits are also embedded in `content.js`. Creative Commons images retain their stated licenses, including CC BY-SA 4.0 for Selina Hossain. The local `content/author-portraits.json` maintains these source records. No faces were generated or reconstructed.
- Bengali font: Noto Sans Bengali, SIL Open Font License; see `assets/OFL.txt`.
- Summaries and Bengali explanations are original paraphrases. No copyrighted book scans are in the deployment ZIP. Storybook artwork in `assets/illustrations/` is generated with the built-in image tool. Each work has one four-column, three-row atlas; the app displays its twelve scenes separately. Character identity, complexion, hair, build and clothing remain consistent within a work, with story-supported changes. These images are interpretations rather than authenticated historical portraits.
- `content/illustration-prompts.json` records the final prompts, continuity bibles and bilingual appearance notes. Explicitly checked textual descriptions have edition links; unverified skin palettes, facial geometry and costume colours are labelled artistic choices. Complexion is never a judgement of virtue or worth. The Word companion includes the same twelve-scene overview and appearance notes.
- To maintain artwork, edit `tools/build_visual_prompts.py`, then regenerate the prompt set. Generate new illustrations with the built-in image tool and record local output paths in the private QA ledger. `node tools/prepare_illustrations.cjs` compresses the finished images for web and Word use. Regenerate content, Word and release after replacing assets. The service-worker fingerprint includes every nested illustration and caches them for offline reading.
- External source websites and original literary works retain their respective rights. Full texts should be consulted through the linked editions.
