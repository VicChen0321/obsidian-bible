import type { BookId, TranslationInfo } from "../core/types";
import type { BookText, LocalTranslationSource } from "../providers/local-provider";
import { CUV_BOOKS } from "./cuv-data.generated";

export const CUV_INFO: TranslationInfo = {
  id: "cuv",
  name: "和合本 (Chinese Union Version, Traditional)",
  abbreviation: "和合本",
  language: "zh-TW",
};

const cache = new Map<BookId, BookText>();

export const cuvSource: LocalTranslationSource = {
  info: CUV_INFO,
  loadBook(book) {
    let text = cache.get(book);
    if (!text) {
      const json = CUV_BOOKS[book];
      if (json === undefined) return Promise.resolve(undefined);
      text = JSON.parse(json) as BookText;
      cache.set(book, text);
    }
    return Promise.resolve(text);
  },
};
