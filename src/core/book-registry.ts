import { BOOK_DATA, type BookNames } from "./book-data";
import { LANGUAGES, type BookId, type Language } from "./types";

export interface BookInfo {
  id: BookId;
  /** 1-based position in the Protestant canon. */
  order: number;
  /** Chapter count under standard Protestant (English) versification. */
  chapters: number;
}

export type BookNameStyle = "full" | "short";

/** Applies NFKC and drops whitespace and periods, so full-width and spaced forms match. */
export function normalizeBookKey(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s.·]/g, "");
}

const books: BookInfo[] = [];
const names = new Map<BookId, Record<Language, BookNames>>();
const aliasIndex = new Map<string, BookInfo>();

BOOK_DATA.forEach((data, index) => {
  const info: BookInfo = { id: data.id, order: index + 1, chapters: data.chapters };
  books.push(info);
  names.set(data.id, data.names);
  for (const language of LANGUAGES) {
    for (const alias of data.names[language]) {
      const key = normalizeBookKey(alias);
      const existing = aliasIndex.get(key);
      if (existing && existing.id !== info.id) {
        throw new Error(`Book alias "${alias}" is ambiguous: ${existing.id} and ${info.id}`);
      }
      aliasIndex.set(key, info);
    }
  }
});

export const BOOKS: readonly BookInfo[] = books;

export function getBook(id: BookId): BookInfo {
  const info = books.find((book) => book.id === id);
  if (!info) throw new Error(`Unknown book id: ${id}`);
  return info;
}

/** Resolves a book name or abbreviation in any supported language. */
export function resolveBook(text: string): BookInfo | undefined {
  return aliasIndex.get(normalizeBookKey(text));
}

export function getBookName(id: BookId, language: Language, style: BookNameStyle): string {
  const entry = names.get(id)?.[language];
  if (!entry) throw new Error(`Unknown book id: ${id}`);
  return style === "full" ? entry[0] : entry[1];
}
