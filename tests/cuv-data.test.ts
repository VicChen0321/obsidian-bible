import { describe, expect, it } from "vitest";
import { BibleService } from "../src/core/bible-service";
import { BOOKS } from "../src/core/book-registry";
import { createBundledProvider } from "../src/data";
import { cuvSource } from "../src/data/cuv";

const service = new BibleService(createBundledProvider());

async function lookup(input: string) {
  const result = await service.lookup(input, "cuv");
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe("bundled CUV data", () => {
  it("has every chapter of every book", async () => {
    for (const book of BOOKS) {
      const text = await cuvSource.loadBook(book.id);
      expect(text, book.id).toHaveLength(book.chapters);
      text?.forEach((chapter, index) => {
        expect(chapter.length, `${book.id} ${index + 1}`).toBeGreaterThan(0);
        expect(chapter[0], `${book.id} ${index + 1}:1`).not.toBe("");
      });
    }
  });

  it("has the standard 31,102 verses", async () => {
    let total = 0;
    for (const book of BOOKS) {
      const text = await cuvSource.loadBook(book.id);
      total += text?.reduce((sum, chapter) => sum + chapter.length, 0) ?? 0;
    }
    expect(total).toBe(31102);
  });

  it("returns known verses", async () => {
    expect((await lookup("創 1:1")).verses[0]?.text).toBe("起初，神創造天地。");
    expect((await lookup("彼前 1:24-25")).verses.map((v) => v.number)).toEqual([24, 25]);
    expect((await lookup("約 3:16")).verses[0]?.text).toContain("神愛世人");
  });

  it("returns a merged verse for any verse it covers", async () => {
    for (const input of ["創 24:29", "創 24:30", "創 24:29-30", "創 24:28-31"]) {
      const verses = (await lookup(input)).verses;
      const merged = verses.find((v) => v.number === 29);
      expect(merged, input).toMatchObject({ number: 29, endNumber: 30 });
      expect(merged?.text, input).toContain("拉班");
    }
    expect((await lookup("創 24:30")).verses).toHaveLength(1);
  });
});
