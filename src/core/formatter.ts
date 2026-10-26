import { getBookName, type BookNameStyle } from "./book-registry";
import type { BibleReference, Language, Passage } from "./types";

export type InsertFormat = "reference" | "blockquote" | "plain";

/** Renders "約翰福音 3", "約翰福音 3:16" or "約翰福音 3:16-18" with the book named in `language`. */
export function formatReference(
  reference: BibleReference,
  language: Language,
  style: BookNameStyle = "short",
): string {
  const book = getBookName(reference.book, language, style);
  const { chapter, verses } = reference;
  if (!verses) return `${book} ${chapter}`;
  const range = verses.end > verses.start ? `${verses.start}-${verses.end}` : `${verses.start}`;
  return `${book} ${chapter}:${range}`;
}

function joinVerses(passage: Passage): string {
  const separator = passage.translation.language === "zh-TW" ? "" : " ";
  return passage.verses.map((verse) => verse.text.trim()).join(separator);
}

/** Traditional Chinese passages omit the translation name, since 和合本 is the usual default. */
export function showsTranslationName(language: Language): boolean {
  return language !== "zh-TW";
}

function heading(passage: Passage): string {
  const { language, abbreviation } = passage.translation;
  const label = formatReference(passage.reference, language, "full");
  return showsTranslationName(language) ? `${label} (${abbreviation})` : label;
}

/** Formats a passage for insertion into a note. The book is named in the translation's language. */
export function formatPassage(passage: Passage, format: InsertFormat): string {
  switch (format) {
    case "reference":
      return `**${formatReference(passage.reference, passage.translation.language, "short")}**`;
    case "plain":
      return joinVerses(passage);
    case "blockquote": {
      const body = joinVerses(passage)
        .split("\n")
        .map((line) => (line ? `> ${line}` : ">"));
      return [`> **${heading(passage)}**`, ">", ...body].join("\n");
    }
  }
}
