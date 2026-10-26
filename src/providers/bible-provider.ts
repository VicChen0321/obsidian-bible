import type { BookId, TranslationInfo } from "../core/types";

/**
 * Source of scripture text. The unit of retrieval is a chapter so that local files and
 * remote APIs can both implement it, and so cross-chapter ranges can be added later
 * without changing the contract. Implementations must not depend on Obsidian.
 */
export interface BibleProvider {
  listTranslations(): Promise<readonly TranslationInfo[]>;

  /**
   * Returns the verse texts of a chapter (index 0 is verse 1), or `undefined` when the
   * translation does not contain that chapter. Throws for unknown translations or I/O failures.
   */
  getChapter(
    translationId: string,
    book: BookId,
    chapter: number,
  ): Promise<readonly string[] | undefined>;
}
