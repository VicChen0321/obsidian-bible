import { describe, expect, it } from "vitest";
import { BibleService } from "../src/core/bible-service";
import type { BibleProvider } from "../src/providers/bible-provider";
import { createFixtureProvider, CUV, SAMPLE } from "./fixtures";

const service = new BibleService(createFixtureProvider());

describe("BibleService", () => {
  it("lists translations", async () => {
    expect(await service.listTranslations()).toEqual([CUV, SAMPLE]);
  });

  it("looks up a verse range", async () => {
    const result = await service.lookup("彼前 1:24-25", "cuv");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.translation).toEqual(CUV);
      expect(result.value.verses.map((v) => v.number)).toEqual([24, 25]);
      expect(result.value.verses[1]?.text).toContain("惟有主的道");
    }
  });

  it("returns the same reference for any name of a book", async () => {
    const a = await service.lookup("彼前 1:24", "cuv");
    const b = await service.lookup("彼得前書 1:24", "cuv");
    expect(a.ok && b.ok).toBe(true);
    expect(a.ok && b.ok && a.value.reference).toEqual(b.ok && b.value.reference);
  });

  it("uses the requested translation", async () => {
    const result = await service.lookup("創 1:2", "sample");
    expect(result.ok && result.value.translation).toEqual(SAMPLE);
    expect(result.ok && result.value.verses[0]?.text).toBe("範例 創 1:2");
  });

  it("looks up a single verse and an entire chapter", async () => {
    const single = await service.lookup("約 3:16", "sample");
    expect(single.ok && single.value.verses).toHaveLength(1);
    const chapter = await service.lookup("約 3", "sample");
    expect(chapter.ok && chapter.value.verses).toHaveLength(36);
  });

  it("returns parse errors unchanged", async () => {
    expect(await service.lookup("耶穌 1:1", "cuv")).toMatchObject({
      ok: false,
      error: { code: "unknown-book" },
    });
  });

  it("rejects unknown translations", async () => {
    expect(await service.lookup("約 3:16", "nope")).toMatchObject({
      ok: false,
      error: { code: "translation-not-found" },
    });
  });

  it("reports missing chapters and verses beyond the chapter", async () => {
    expect(await service.lookup("出 1:1", "sample")).toMatchObject({
      ok: false,
      error: { code: "passage-not-found" },
    });
    expect(await service.lookup("約 3:30-40", "sample")).toMatchObject({
      ok: false,
      error: { code: "passage-not-found", message: "約翰福音 3 has only 36 verses in 範例." },
    });
  });

  it("merges verses that the provider marks as covered by the previous one", async () => {
    const merged: BibleProvider = {
      listTranslations: () => Promise.resolve([SAMPLE]),
      getChapter: () => Promise.resolve(["一", "二", "", "四"]),
    };
    const result = await new BibleService(merged).lookup("創 1:3", "sample");
    expect(result.ok && result.value.verses).toEqual([{ number: 2, endNumber: 3, text: "二" }]);
  });

  it("converts provider exceptions into errors", async () => {
    const broken: BibleProvider = {
      listTranslations: () => Promise.resolve([SAMPLE]),
      getChapter: () => Promise.reject(new Error("disk on fire")),
    };
    const result = await new BibleService(broken).lookup("約 3:16", "sample");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("provider-failure");
      expect(result.error.message).toContain("disk on fire");
    }
  });
});
