import type { BibleProvider } from "../providers/bible-provider";
import { formatReference } from "./formatter";
import { parseReference } from "./reference-parser";
import {
  err,
  ok,
  type BibleReference,
  type Passage,
  type Result,
  type TranslationInfo,
  type Verse,
} from "./types";

/**
 * Converts a provider chapter into verses. An empty string marks a verse covered by the
 * previous entry (merged verses such as 29-30), which becomes one verse with `endNumber`.
 */
function toVerses(chapter: readonly string[]): Verse[] {
  const verses: Verse[] = [];
  chapter.forEach((text, index) => {
    const number = index + 1;
    const previous = verses[verses.length - 1];
    if (text === "" && previous) {
      previous.endNumber = number;
    } else {
      verses.push({ number, text });
    }
  });
  return verses;
}

export class BibleService {
  constructor(private readonly provider: BibleProvider) {}

  listTranslations(): Promise<readonly TranslationInfo[]> {
    return this.provider.listTranslations();
  }

  /** Parses `input` and fetches the passage from the given translation. */
  async lookup(input: string, translationId: string): Promise<Result<Passage>> {
    const parsed = parseReference(input);
    if (!parsed.ok) return parsed;
    return this.getPassage(parsed.value, translationId);
  }

  async getPassage(reference: BibleReference, translationId: string): Promise<Result<Passage>> {
    try {
      const translations = await this.provider.listTranslations();
      const translation = translations.find((candidate) => candidate.id === translationId);
      if (!translation) {
        return err("translation-not-found", `Unknown translation "${translationId}".`);
      }

      const chapter = await this.provider.getChapter(
        translationId,
        reference.book,
        reference.chapter,
      );
      const label = formatReference(reference, translation.language, "full");
      if (!chapter || chapter.length === 0) {
        return err("passage-not-found", `${translation.abbreviation} has no text for ${label}.`);
      }

      const start = reference.verses?.start ?? 1;
      const end = reference.verses?.end ?? chapter.length;
      if (end > chapter.length) {
        const chapterLabel = formatReference(
          { book: reference.book, chapter: reference.chapter },
          translation.language,
          "full",
        );
        return err(
          "passage-not-found",
          `${chapterLabel} has only ${chapter.length} verses in ${translation.abbreviation}.`,
        );
      }

      const verses = toVerses(chapter).filter(
        (verse) => verse.number <= end && (verse.endNumber ?? verse.number) >= start,
      );
      return ok({ reference, translation, verses });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      return err("provider-failure", `Could not load scripture: ${detail}`);
    }
  }
}
