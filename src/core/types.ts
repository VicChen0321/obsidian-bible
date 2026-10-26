export const LANGUAGES = ["zh-TW"] as const;
export type Language = (typeof LANGUAGES)[number];

/** Canonical book identifiers (USFM 3-letter codes), in Protestant canon order. */
// prettier-ignore
export const BOOK_IDS = [
  "GEN", "EXO", "LEV", "NUM", "DEU", "JOS", "JDG", "RUT", "1SA", "2SA", "1KI", "2KI", "1CH", "2CH",
  "EZR", "NEH", "EST", "JOB", "PSA", "PRO", "ECC", "SNG", "ISA", "JER", "LAM", "EZK", "DAN", "HOS",
  "JOL", "AMO", "OBA", "JON", "MIC", "NAM", "HAB", "ZEP", "HAG", "ZEC", "MAL", "MAT", "MRK", "LUK",
  "JHN", "ACT", "ROM", "1CO", "2CO", "GAL", "EPH", "PHP", "COL", "1TH", "2TH", "1TI", "2TI", "TIT",
  "PHM", "HEB", "JAS", "1PE", "2PE", "1JN", "2JN", "3JN", "JUD", "REV",
] as const;
export type BookId = (typeof BOOK_IDS)[number];

export interface VerseRange {
  /** 1-based, inclusive. */
  start: number;
  /** 1-based, inclusive. Equals `start` for a single verse. */
  end: number;
}

/**
 * Translation-independent reference. Chapter numbers follow the standard
 * Protestant (English) versification. Omitted `verses` means the entire chapter.
 */
export interface BibleReference {
  book: BookId;
  chapter: number;
  verses?: VerseRange;
}

export interface TranslationInfo {
  /** Stable identifier used in settings, e.g. "cuv". */
  id: string;
  /** Full name, e.g. "King James Version". */
  name: string;
  /** Short label used in inserted headings, e.g. "和合本". */
  abbreviation: string;
  language: Language;
}

export interface Verse {
  number: number;
  /** Set when the source merges several verses into one entry, e.g. 29-30. */
  endNumber?: number;
  text: string;
}

export interface Passage {
  reference: BibleReference;
  translation: TranslationInfo;
  verses: Verse[];
}

export type BibleErrorCode =
  | "empty"
  | "missing-book"
  | "unknown-book"
  | "missing-chapter"
  | "invalid-syntax"
  | "invalid-chapter"
  | "invalid-verse"
  | "invalid-range"
  | "unsupported-range"
  | "translation-not-found"
  | "passage-not-found"
  | "provider-failure";

export interface BibleError {
  code: BibleErrorCode;
  message: string;
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: BibleError };

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err<T = never>(code: BibleErrorCode, message: string): Result<T> {
  return { ok: false, error: { code, message } };
}
