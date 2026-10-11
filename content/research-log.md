# Research and lecture coverage

## English listening and author portraits · 11 October 2026

All 528 cards have locally generated neural English recordings of their heading and complete English explanation. The Kokoro 82M v1.0 model uses the `af_heart` (Heart) voice at speed 0.92. Playback uses these finished MP3 files, with user-started Listen, Pause, Resume, Stop, seeking and pace controls; device speech synthesis has been replaced. Source: https://huggingface.co/hexgrad/Kokoro-82M and https://github.com/thewh1teagle/kokoro-onnx. The model and voice files were downloaded from the upstream release and SHA256-verified. Audio generation is local and has no runtime provider dependency. The local `content/audio-manifest.json` ties each recording to the SHA256 of the exact English card text and generation settings.

Each of the 44 works has an Author tab before Quiz. Eighteen portraits were obtained from Wikimedia Commons with image source, creator, reuse license and resizing credits retained beneath the image. Sources and license metadata were retrieved from Commons image records on 11 October 2026; the editable local record is `content/author-portraits.json`. The nine other author guides (six early/oral author identities and Farrukh Ahmad, Anwar Pasha, Abu Ishaque) use a clearly labelled original manuscript symbol because a verified reusable portrait was not found in this pass. The symbol is not a historical likeness. No author faces were generated.

Portraits and the narration player are included in the core offline cache. Audio is cached after listening or with Save story audio offline, which stores the twelve recordings of the selected story and shows a completion count. Audio responses support byte ranges for seeking offline. Stories, scene order, endings, bilingual text and quiz answers are unchanged by this feature update. The local Word companion's learning text is unchanged; runtime uploads still exclude Python, model weights, Word documents and lecture PDFs.

Prepared 10 October 2026. This log accompanies the bilingual catalogue and Word companion.

## Scope

18 scanned files contain 30 lectures and 582 pages. All pages were extracted and Bengali OCR processed. Relevant narrative sections were reviewed; OCR is a reading aid and can misread names, numbers and multi-column text. The originals remain in the source folder and are not redistributed in the publication package.

The learning library contains 44 selected works, each with exactly 12 bilingual cards and three custom recall questions. Six lyric/collection guides are explicitly **Poem journeys**; 38 narrative works include their principal developments and endings. A separate 77-author library lists additional major works. A listed title without a card button does not imply an existing full retelling. This is a curated learning guide, not a transcription of every work or examination answer in the lectures.

## How references were used

- **Primary texts:** public-domain editions and translations on Project Gutenberg and Wikisource; Rokeya’s original English story; the Open University teaching edition of Hajar Bachhar Dhare. These support narrative details and endings where available.
- **University materials:** Bichitra is a Jadavpur University archive for consulting Tagore editions. The archive’s landing page is an edition-finding reference, not by itself proof of every plot point. Bangladesh Open University materials provide original texts and teaching discussions. Kharagpur College’s analysis supports the road motif in Pather Panchali.
- **Banglapedia:** genre, literary context, author identities, publication information and some direct narrative outlines. Its entries are not assumed infallible. The Lalsalu, Gitika, Mangalkavya, Padmavati, Charyapada and Bisad-Sindhu entries are especially relevant.
- **Library catalogue:** Parliament Library corroborates a 1969 Arek Falgun edition. A catalogue date does not independently verify a story’s plot or prove that no earlier edition existed.
- **Author interview and scholarly research:** Selina Hossain’s interview distinguishes fiction from history and the novel from its film adaptation. Comparative research on Rifle Roti Aurat corroborates its central teacher, experiential form and war chronology. Teaching discussions corroborate the Badiul Alam character in Aguner Poroshmoni.
- **Secondary reporting:** used for limited biographical correction and context. Film descriptions are not substituted for complete novel plots. Public-domain Pather Panchali’s final instalment was consulted in a community transcription and read alongside literary study references; that transcription is not a critical edition.

Source purposes are displayed individually in the app and document. Some references establish author/date/context rather than the entire plot. The summaries compress subplots and use original Bengali and English paraphrases. Symbolic motifs and interpretive explanations are learning aids. These are not annotated critical editions or line-by-line translations.

## Corrections and distinctions

**Srikrishnakirtan:** Lecture 2, pages 4–5 supplies the narrative and explicitly marks the missing continuation. [Banglapedia](https://en.banglapedia.org/index.php?title=Srikrishnakirtan) corroborates Baru Chandidas, the three principal figures and thirteen sections. The twelve cards combine Bhara and Chhatra. The early coercive encounter is identified as coercion. Radha's final separation has no invented resolution; the surviving manuscript breaks off. Approximate composition is distinguished from its modern recovery and publication.

1. **Charyapada:** discovery in Nepal in 1907 is distinct from much earlier composition. Scholarly dates differ. Counts can distinguish complete songs, fragments and lost manuscript leaves; a single unexplained total is avoided.
2. **Period boundaries:** the timeline is a study framework. Tagore-era and modern poetry overlap; composition and publication dates are not used to imply rigid period membership.
3. **Manasamangal and Chandimangal:** multiple authors and versions exist. Behula’s journey and both branches of Mukunda’s Chandi tradition are retained; variable numbers and episode details are not treated as universal.
4. **Mahua:** Dwij Kanai’s attribution and oral variation are labelled. Exeter’s digitised selection contains Malua, Dewan Bhavna, Dasyu Kenaram and Kanka o Leela, not Mahua. It is supplementary ballad context.
5. **Padmavati:** Alaol’s 1652 adaptation is literary romance. The queen’s story is not presented as proven historical biography.
6. **Meghnadbadh:** the nine-canto epic shifts sympathy toward Lanka. Ramayana-derived events are literary material, not historical claims.
7. **Nil Darpan:** Bengali original 1860; English edition 1861. The printed translation says “A Native”; attribution of the translation to Michael is disputed and is not stated as settled fact.
8. **Bisad-Sindhu:** three publication movements, 1885, 1887 and 1891. Fictional personal motives and supernatural episodes do not form a dependable factual history of Karbala.
9. **Tagore’s Dena Paona:** the 1891 short story about Nirupama is distinct from Sarat Chandra’s later novel with the same title.
10. **Ghare Baire:** Amulya dies and Nikhil returns critically wounded. Nikhil’s ultimate survival is not supplied as a certain ending.
11. **Dakghar:** Amal’s final sleep carries symbolic ambiguity. A confirmed medical cure is not invented.
12. **Pather Panchali:** the novel continues beyond the film’s village departure. Benares, Harihar’s death, Sarbajaya’s dependent work, Apu’s friendship with Leela and the continuing road are included. Film events from Aparajito are not appended as though the two books were identical.
13. **Putul Nacher Itikatha:** the title is not evidence that the author endorses supernatural fatalism. Social forces, psychology and human decisions are discussed together.
14. **Lalsalu:** Bengali novel 1948; the later English Tree Without Roots changes material. The final scene and uncertainty are retained rather than replaced by a neat moral resolution.
15. **Arek Falgun:** the story commemorates the 1952 martyrs in February 1955; the cited catalogue records publication in 1969. The dates are kept separate.
16. **Zahir Raihan:** Banglapedia currently contains conflicting disappearance information. Reporting corroborates 30 January 1972. The guide uses “1935–1972; disappeared,” rather than repeating the erroneous December 1971 date. Shahidullah Kaiser’s disappearance/murder belongs to December 1971.
17. **Hajar Bachhar Dhare:** the Open University teaching edition’s ending confirms Tuni’s refusal on the boat, Montu’s later family with Ambia and the next generation’s continuing puthi recitation. The ending is cyclical, not a successful Tuni–Montu marriage.
18. **Aguner Poroshmoni:** the novel and film dates differ. The final waiting around wounded Alam is not converted into a confirmed recovery or a death announcement.
19. **Hangor Nodi Grenade:** the novel, its real-life inspiration and the film are distinct. Rois’s disability does not reduce his dignity; the sacrifice is described as a devastating loss under coercion.
20. **Rifle Roti Aurat:** written during 1971, published posthumously in 1973. The closing hope for freedom is not a retrospective December victory scene.
21. **Poems:** repeated images and addresses are explained without adding fictional protagonists, marriages or events. Banalata Sen’s poem and collection dates are differentiated; Chharpatra’s publication date is not represented as a proven composition date for every poem.

## Lecture map

| Lectures | Pages | Principal learning topics |
|---|---:|---|
| 1 | 15 | Charyapada, siddhacharyas, dating and language |
| 2 | 7 | Srikrishnakirtan and Baru Chandidas |
| 3 | 40 | Mangalkavya and its major branches |
| 4 | 24 | Translation traditions, Vaishnava poetry, romances and Alaol |
| 5–6 | 18 | Nath, marsiya, Baul, Shakta, ballads, Ishwar Gupta |
| 7 | 17 | Michael Madhusudan Dutt and Kaykobad |
| 8 | 16 | Tagore’s poetry and principal collections |
| 9–10 | 28 | Nazrul’s poetry, songs and literary context |
| 11 | 7 | Jasimuddin, Mohitlal, Satyendranath Dutta |
| 12–13 | 48 | Modern poetry, Jibanananda, Sukanta and Sufia Kamal |
| 14 | 18 | Tagore’s short stories |
| 15 | 35 | Tagore’s novels and plays |
| 16–18 | 34 | Prose, Vidyasagar, Rokeya, Pramatha and Kazi Abdul Wadud |
| 19–20 | 35 | Drama and poetry, Dinabandhu, Munier and Shamsur Rahman |
| 21–22 | 32 | Later poets and prose writers, Farrukh and contemporaries |
| 23–25 | 76 | Bankim, Tarashankar, Bibhutibhushan, Mir Mosharraf and Sarat |
| 26–27 | 58 | Bangladesh fiction and drama, women writers and major novelists |
| 28–30 | 74 | Print/prose history, Manik, Waliullah, rural and war fiction |

Early texts and non-narrative prose also appear in author guides. Their absence from a twelve-card plot retelling does not mean the lecture has been omitted. The raw lecture scans, OCR, source retrieval attempts and runtime screenshots stay in the local QA folder.

## Narration review and revision · 11 October 2026

All 44 twelve-card sequences (528 English passages) were read for continuity, accessible scene-setting, character motivation, forward momentum and truthful endings. Revised passages were edited in both English and Bengali; existing translations of the retained cards remain unchanged. The library hooks already establish a clear curiosity gap. The main weakness was the textbook tone of several introductions, with abstract commentary arriving before a reader could picture a place or action.

The first two cards of all 44 works and two additional Postmaster cards were rewritten in both languages: 90 bilingual passages in total. The revisions use the existing plot facts, introduce people through actions, and connect immediate needs to the next event. Later cards were retained where their sequence and emotional consequence were already clear. Six poem journeys still explain images and ideas rather than inventing plots. No invented dialogue, new plot event, rescued ending or claim that an unresolved fate is settled was added. Card headings, scene ordering, illustrations, appearance notes, source links and quizzes are unchanged.

The editable revisions are kept in the local content/narration-revisions.json, applied by the local content generator. They are not additional deployment dependencies: the published app receives the revised prose in content.js. A review ledger and original catalogue snapshot remain in local QA.

Installed-app UI now hides the installation promotion in standalone, minimal-ui, fullscreen, window-controls-overlay and iOS standalone launches, and after the appinstalled event. Display-mode changes and pageshow refresh the control. This follows [Chrome's PWA detection guidance](https://web.dev/learn/pwa/detection/). Installation state is not permanently inferred from an old local-storage flag, so a stale flag cannot prevent a future reinstall.

## Storybook appearance audit · 10 October 2026

All 44 works have a separate twelve-scene illustrated atlas, generated with the built-in image_gen tool. The web reader displays individual panels; the Word companion contains the same twelve-panel overview. Character faces remain consistent within each work. Colour prejudice in a narrative is retained for critical reading and is never treated as a measure of virtue.

Appearance passages checked against primary texts: Gora (chapters II–III), The Home and the World (opening chapter), Samapti (opening chapter), Shasti (second section), and Stories from Tagore (The Cabuliwallah, The Home-Coming and The Postmaster). Direct links and specific supported traits are recorded in content/illustration-prompts.json and displayed in People and Sources. Chandara's very dark eyes are not misrepresented as a textual claim about her skin. Anandamoyi's apparent age under forty, slender build and dark complexion follow chapter III.

For other works, precise faces, complexions, body shapes and costume colours are explicitly labelled artistic interpretations rather than verified author descriptions. Poem panels illustrate imagery and metaphors rather than inventing literal plots. Tragic episodes use absence, grief and atmosphere; the written story cards preserve the events. These illustrations are interpretive aids, not historical portraits or film likenesses.
