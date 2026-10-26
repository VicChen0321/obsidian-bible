import { getBook, resolveBook, type BookInfo } from "./book-registry";
import { err, ok, type BibleReference, type Result, type VerseRange } from "./types";

/** Longest chapter in the Bible is Psalm 119 with 176 verses, so no versification exceeds this. */
const MAX_VERSE = 176;

const DASH_LIKE = /[‐-―−〜~]/g;

function normalizeInput(input: string): string {
  return (
    input
      .normalize("NFKC")
      .replace(/\s+/g, " ")
      .trim()
      .replace(DASH_LIKE, "-")
      // "3章16節": chapter/verse markers become punctuation.
      .replace(/(\d)\s*章\s*/g, "$1:")
      .replace(/(\d)\s*[節节]$/, "$1")
      .replace(/\s*([:-])\s*/g, "$1")
      .replace(/:$/, "")
  );
}

function validate(book: BookInfo, chapter: number, verses?: VerseRange): Result<BibleReference> {
  if (chapter < 1 || chapter > book.chapters) {
    return err(
      "invalid-chapter",
      `Chapter ${chapter} is out of range (book has ${book.chapters}).`,
    );
  }
  if (verses) {
    if (verses.start < 1 || verses.start > MAX_VERSE) {
      return err("invalid-verse", `Verse ${verses.start} is out of range.`);
    }
    if (verses.end < 1 || verses.end > MAX_VERSE) {
      return err("invalid-verse", `Verse ${verses.end} is out of range.`);
    }
    if (verses.end < verses.start) {
      return err("invalid-range", `Range ${verses.start}-${verses.end} ends before it starts.`);
    }
  }
  const reference: BibleReference = { book: book.id, chapter };
  if (verses) reference.verses = verses;
  return ok(reference);
}

function parseTail(book: BookInfo, tail: string): Result<BibleReference> {
  const unsupported = () =>
    err<BibleReference>(
      "unsupported-range",
      "Ranges across chapters are not supported yet. Look up each chapter separately.",
    );

  if (/^\d+:\d+-\d+:\d+$/.test(tail)) return unsupported();

  let match = /^(\d+)$/.exec(tail);
  if (match) {
    const n = Number(match[1]);
    // In single-chapter books ("Jude 5") a bare number is a verse.
    if (book.chapters === 1) return validate(book, 1, { start: n, end: n });
    return validate(book, n);
  }

  match = /^(\d+)-(\d+)$/.exec(tail);
  if (match) {
    if (book.chapters !== 1) return unsupported();
    return validate(book, 1, { start: Number(match[1]), end: Number(match[2]) });
  }

  match = /^(\d+):(\d+)(?:-(\d+))?$/.exec(tail);
  if (match) {
    const start = Number(match[2]);
    const end = match[3] === undefined ? start : Number(match[3]);
    return validate(book, Number(match[1]), { start, end });
  }

  return err(
    "invalid-syntax",
    `Could not understand "${tail}". Use a form like 3, 3:16 or 3:16-18.`,
  );
}

/** Distinguishes an unknown book from malformed chapter/verse text that was mistaken for a book. */
function unrecognized(bookText: string, fullText: string): Result<BibleReference> {
  // A digit after a letter means the "book" swallowed chapter/verse text, e.g. "約 3:16,".
  return /[^\d\s]\s*\d|[:-]$/.test(bookText)
    ? err(
        "invalid-syntax",
        `Could not understand "${fullText}". Use a form like 3, 3:16 or 3:16-18.`,
      )
    : err("unknown-book", `Unknown book "${bookText}".`);
}

/**
 * Parses a Bible reference such as "彼前 1:24-25" or "約翰福音 3:16".
 * Independent of any Bible translation.
 */
export function parseReference(input: string): Result<BibleReference> {
  const text = normalizeInput(input);
  if (!text) return err("empty", "Enter a Bible reference, e.g. 約 3:16.");

  const match = /^(.*?)\s*(\d+(?:[:-]\d+)*)$/.exec(text);
  if (!match) {
    return resolveBook(text)
      ? err("missing-chapter", "Add a chapter, e.g. 3 or 3:16.")
      : unrecognized(text, text);
  }

  const bookText = (match[1] ?? "").trim();
  const tail = match[2] ?? "";
  if (!bookText) return err("missing-book", "Add a book name before the chapter.");

  const resolved = resolveBook(bookText);
  if (!resolved) return unrecognized(bookText, text);

  return parseTail(getBook(resolved.id), tail);
}
