# Contributing

Thanks for helping with Bible Lookup.
Small, focused changes are easiest to review.

## Setup

```bash
pnpm install
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

All four checks must pass before a change is merged.
CI runs the same commands.

## Ground rules

- Keep `src/core/` and `src/providers/` free of `obsidian` imports.
  A lint rule enforces this.
- Do not use Node.js APIs in code under `src/`.
  The plugin must keep working on mobile.
- Parsing must not depend on the selected translation.
- Add tests for core changes.
  Prefer table-driven tests.
- Never edit `src/data/*.generated.ts` by hand.
  Regenerate it with `pnpm data:build path/to/bible_zh_cuv.json`.

## Testing in a development vault

Unit tests do not start Obsidian.
Verify UI changes by hand in a vault you do not mind modifying.

1. Build the plugin with `pnpm build`, or run `pnpm dev` to rebuild on change.
2. Link the build into a vault:

   ```bash
   VAULT=/path/to/vault
   mkdir -p "$VAULT/.obsidian/plugins/bible-lookup"
   for f in main.js manifest.json styles.css; do
     ln -sf "$PWD/$f" "$VAULT/.obsidian/plugins/bible-lookup/$f"
   done
   ```

3. Restart Obsidian or reload the vault, then enable "Bible Lookup" under Settings, Community plugins.
4. After each rebuild, reload the plugin.
   Disable and re-enable it, or run `obsidian plugin:reload id=bible-lookup` if you use the Obsidian CLI.

Check at least the following:

- **Lookup verse** opens with the input focused, in a note and with no note open.
- `彼前 1:24-25` and `彼得前書 1:24-25` show the same passage.
- Invalid input such as `耶穌 1:1`, `約 22` and `約 3:99` shows a clear message and does not insert anything.
- Enter inserts, Escape closes, and a single undo removes the whole insertion.
- Enter does not insert while an input method is composing text.
- **Lookup selected reference** pre-fills the selection and does not replace it.
- Each insert format produces the expected Markdown.
- Settings persist after reloading the plugin.
- In Obsidian's mobile emulation, the window fits a narrow screen and the Insert button works.

## Adding a translation

1. Confirm the license allows redistribution, and record the source and terms in `DATA_LICENSES.md`.
   Do not substitute one translation for another.
2. Write a build script like `scripts/build-data.mjs` that validates the source and fails on gaps or duplicates.
3. Add a `LocalTranslationSource` under `src/data/` and register it in `src/data/index.ts`.
4. Add tests that check chapter counts and a few known verses.

No parser or UI change is needed.

## Commits

Use short, imperative messages, for example `feat(core): support chapter ranges`.
