# Bible text attribution and licensing

This file records where the bundled scripture text came from.
It states what is known, and what has **not** been verified.

## Bundled translation

| ID    | Name                                        | Language | File                             |
| ----- | ------------------------------------------- | -------- | -------------------------------- |
| `cuv` | 和合本 (Chinese Union Version, Traditional) | zh-TW    | `src/data/cuv-data.generated.ts` |

No other scripture text is bundled.

## Provenance

- The text was copied from the maintainer's earlier project, which had collected it from bible.com (version id 46) with a script.
- `scripts/build-data.mjs` converts that file into the generated module.
  It trims whitespace, rewrites the 70 verses that the source merges (such as Genesis 24:29-30), and fails on missing chapters, gaps or duplicates.
- The result has 66 books and 31,102 verse positions.
  The merged verses keep their combined text on the first verse.
  Splitting them into separate verses is not possible without another source.

## Licensing status

- The 1919 Chinese Union Version translation is generally regarded as public domain.
- **Not verified:** whether the bible.com edition adds publisher-specific content, such as modern punctuation or corrections, that carries its own copyright, and whether the site's terms allowed this copying.
- The maintainer decided to bundle this text.
  That decision does not settle the questions above, so treat the text as unverified.
- If you are a rights holder and have a concern about this text, please open an issue and it will be addressed promptly.

## Updating the data

```bash
pnpm data:build path/to/bible_zh_cuv.json
```

The generated file must not be edited by hand.
