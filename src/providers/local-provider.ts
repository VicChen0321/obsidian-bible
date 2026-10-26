import type { BookId, TranslationInfo } from "../core/types";
import type { BibleProvider } from "./bible-provider";

/** Chapters of one book; index 0 is chapter 1, and each chapter lists verse texts from verse 1. */
export type BookText = readonly (readonly string[])[];

export interface LocalTranslationSource {
  info: TranslationInfo;
  /** Loads one book lazily, so large translations need not be parsed up front. */
  loadBook(book: BookId): Promise<BookText | undefined>;
}

export function createInMemorySource(
  info: TranslationInfo,
  books: Partial<Record<BookId, BookText>>,
): LocalTranslationSource {
  return { info, loadBook: (book) => Promise.resolve(books[book]) };
}

export class LocalProvider implements BibleProvider {
  private readonly sources = new Map<string, LocalTranslationSource>();

  constructor(sources: readonly LocalTranslationSource[]) {
    for (const source of sources) {
      if (this.sources.has(source.info.id)) {
        throw new Error(`Duplicate translation id: ${source.info.id}`);
      }
      this.sources.set(source.info.id, source);
    }
  }

  listTranslations(): Promise<readonly TranslationInfo[]> {
    return Promise.resolve([...this.sources.values()].map((source) => source.info));
  }

  async getChapter(
    translationId: string,
    book: BookId,
    chapter: number,
  ): Promise<readonly string[] | undefined> {
    const source = this.sources.get(translationId);
    if (!source) throw new Error(`Unknown translation: ${translationId}`);
    const text = await source.loadBook(book);
    return text?.[chapter - 1];
  }
}
