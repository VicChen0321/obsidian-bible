# Obsidian Bible

A lightweight, keyboard-first Bible reference lookup plugin for [Obsidian](https://obsidian.md).
It is built for taking sermon notes and studying scripture without leaving the editor.

Type a reference such as `彼前 1:24-25`, see the passage, and press Enter to insert it into your note.
Book names and abbreviations are understood in Traditional Chinese.

This is not a Bible reading app.
It does one thing: find a passage and put it in your note.

## Features

- Look up a passage from a Traditional Chinese reference, such as `彼前 1:24-25` or `約翰福音 3:16`.
- Preview the passage with book, chapter, verse range and translation.
- Insert a blockquote with the scripture, a bold reference only, or plain text.
- Look up a reference you have selected in a note.
- Works offline.
  The scripture text is bundled with the plugin.
- Works on desktop and mobile.
  The plugin uses no Node.js APIs.

## Commands

Open the command palette and search for "Obsidian Bible".

| Command                   | What it does                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| Lookup verse              | Opens the lookup window. Enter inserts the passage when a note is open, otherwise it previews. |
| Insert verse              | Opens the lookup window for the current editor.                                                |
| Lookup selected reference | Opens the lookup window with your selected text filled in.                                     |

In the lookup window, press Enter to insert and Escape to close.
On mobile, use the Insert button.
Enter is ignored while an input method (IME) is composing text.

## Reference syntax

Parsing does not depend on the selected translation.
Every name and abbreviation of a book gives the same result.

| Kind                      | Examples                                    |
| ------------------------- | ------------------------------------------- |
| Single verse              | `約 3:16`, `約翰福音 3:16`                  |
| Verse range               | `彼前 1:24-25`, `彼得前書 1:24-25`          |
| Whole chapter             | `約翰福音 3`, `詩 23`                       |
| No spaces                 | `約3:16`, `彼前1:24-25`                     |
| Chapter and verse markers | `約翰福音 3章16節`, `約翰福音 3章16-18節`   |
| Epistles with numbers     | `約壹 4:8`, `約一 4:8`, `林前 13:4`         |
| Single-chapter books      | `猶 5`, `猶 3-5` (a bare number is a verse) |

Full-width digits and punctuation, and `-`, `－`, `～`, en and em dashes, are accepted.
Ranges that cross chapters, such as `約 3:16-4:2`, are not supported yet.

## Insert formats

The default format is set in the plugin settings, and can be changed for each insertion in the lookup window.

**Blockquote** (default)

```markdown
> **彼得前書 1:24-25**
>
> 因為凡有血氣的，盡都如草，他的美榮都像草上的花。草必枯乾，花必凋謝；惟有主的道是永存的。所傳給你們的福音就是這道。
```

**Reference only** inserts just the citation, with no scripture text.
Use it to mark which passage a sermon is on.

```markdown
**彼前 1:24-25**
```

**Plain text**

```text
因為凡有血氣的，盡都如草，……
```

Insertion never deletes text.
If you have a selection, the passage is inserted after it.
A blockquote always starts on its own line, and the whole insertion is one undo step.

## Translations

| ID    | Translation                                 | Language |
| ----- | ------------------------------------------- | -------- |
| `cuv` | 和合本 (Chinese Union Version, Traditional) | zh-TW    |

Only Traditional Chinese book names are understood for now.

**Licensing:** see [DATA_LICENSES.md](DATA_LICENSES.md) for where the text came from and what has not been verified.
The text has not been confirmed as free to redistribute, so check that file before publishing or redistributing this plugin.

## Installation

The plugin is not in the Obsidian community plugin directory yet.

To install a build manually:

1. Create the folder `<your vault>/.obsidian/plugins/obsidian-bible/`.
2. Copy `main.js`, `manifest.json` and `styles.css` into it.
3. In Obsidian, open Settings, then Community plugins, and enable "Obsidian Bible".

To develop against a local vault, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

Requires Node.js and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev         # rebuild main.js on change
pnpm build       # type check, then production build
pnpm lint        # ESLint (with Obsidian's rules) and Prettier
pnpm typecheck
pnpm test
```

### Architecture

```text
src/
├── core/        Parser, book registry, service, formatter. No Obsidian imports.
├── providers/   The BibleProvider contract and a local provider.
├── data/        Bundled translation data and its loader.
├── ui/          The lookup modal and editor insertion rules.
├── settings/    Settings model and settings tab.
└── main.ts      Registers commands and wires everything together.
```

`core/` and `providers/` are independent of Obsidian, which is enforced by a lint rule.
This keeps them reusable for a future command-line tool.

## Known limitations

- Only the 和合本 is bundled.
- Verses that the source merges (for example Genesis 24:29-30) cannot be split.
  Looking up either verse returns the merged text.
- Chapter counts follow the standard Protestant English versification.
- Cross-chapter ranges are not supported.
- Book names are Traditional Chinese only.
  Other languages are not supported yet.
- Messages in the lookup window are in English only.
- The plugin was exercised in Obsidian on desktop, including mobile emulation.
  It has not been tested on a physical phone or tablet.

## License

The plugin source code is released under the [MIT License](LICENSE).
The bundled scripture text is covered separately, see [DATA_LICENSES.md](DATA_LICENSES.md).
