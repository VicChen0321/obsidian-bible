import { describe, expect, it } from "vitest";
import { BOOK_DATA } from "../src/core/book-data";
import { BOOKS, getBookName, resolveBook } from "../src/core/book-registry";
import { BOOK_IDS, LANGUAGES } from "../src/core/types";

describe("book registry", () => {
  it("has the 66 canonical books in order", () => {
    expect(BOOKS.map((book) => book.id)).toEqual([...BOOK_IDS]);
    expect(BOOKS).toHaveLength(66);
  });

  it("has 1189 chapters in total", () => {
    expect(BOOKS.reduce((sum, book) => sum + book.chapters, 0)).toBe(1189);
  });

  it.each(BOOK_IDS.flatMap((id) => LANGUAGES.map((language) => [id, language] as const)))(
    "%s resolves from its %s full and short names",
    (id, language) => {
      expect(resolveBook(getBookName(id, language, "full"))?.id).toBe(id);
      expect(resolveBook(getBookName(id, language, "short"))?.id).toBe(id);
    },
  );

  it("resolves every alias to its own book", () => {
    for (const book of BOOK_DATA) {
      for (const language of LANGUAGES) {
        for (const alias of book.names[language]) {
          expect(resolveBook(alias)?.id, alias).toBe(book.id);
        }
      }
    }
  });

  it.each([
    ["彼前", "1PE"],
    ["彼得前書", "1PE"],
    ["約", "JHN"],
    ["約翰福音", "JHN"],
    ["創", "GEN"],
    ["創世記", "GEN"],
    ["約壹", "1JN"],
    ["約一", "1JN"],
    ["約翰壹書", "1JN"],
    ["約三", "3JN"],
    ["猶", "JUD"],
    ["啟", "REV"],
    ["林前", "1CO"],
    [" 彼 前 ", "1PE"],
  ])("resolves %s to %s", (alias, id) => {
    expect(resolveBook(alias)?.id).toBe(id);
  });

  it.each(["", "彼", "彼得", "約翰書", "約四", "John"])("does not resolve %j", (alias) => {
    expect(resolveBook(alias)).toBeUndefined();
  });
});
