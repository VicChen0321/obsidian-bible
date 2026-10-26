import { describe, expect, it } from "vitest";
import { formatPassage, formatReference, showsTranslationName } from "../src/core/formatter";
import type { BibleReference, Passage } from "../src/core/types";
import { CUV } from "./fixtures";

const peter: Passage = {
  reference: { book: "1PE", chapter: 1, verses: { start: 24, end: 25 } },
  translation: CUV,
  verses: [
    { number: 24, text: "因為凡有血氣的，盡都如草，他的美榮都像草上的花。草必枯乾，花必凋謝；" },
    { number: 25, text: "惟有主的道是永存的。所傳給你們的福音就是這道。" },
  ],
};

describe("formatReference", () => {
  const range: BibleReference = { book: "1PE", chapter: 1, verses: { start: 24, end: 25 } };

  it.each<[BibleReference, "short" | "full", string]>([
    [range, "short", "彼前 1:24-25"],
    [range, "full", "彼得前書 1:24-25"],
    [{ book: "JHN", chapter: 3, verses: { start: 16, end: 16 } }, "short", "約 3:16"],
    [{ book: "JHN", chapter: 3 }, "full", "約翰福音 3"],
  ])("formats %j as %s", (reference, style, expected) => {
    expect(formatReference(reference, "zh-TW", style)).toBe(expected);
  });
});

describe("formatPassage", () => {
  it("formats reference only", () => {
    expect(formatPassage(peter, "reference")).toBe("**彼前 1:24-25**");
  });

  it("formats a blockquote without the translation name", () => {
    expect(formatPassage(peter, "blockquote")).toBe(
      [
        "> **彼得前書 1:24-25**",
        ">",
        "> 因為凡有血氣的，盡都如草，他的美榮都像草上的花。草必枯乾，花必凋謝；惟有主的道是永存的。所傳給你們的福音就是這道。",
      ].join("\n"),
    );
  });

  it("formats plain text", () => {
    expect(formatPassage(peter, "plain")).toBe(
      "因為凡有血氣的，盡都如草，他的美榮都像草上的花。草必枯乾，花必凋謝；惟有主的道是永存的。所傳給你們的福音就是這道。",
    );
  });

  it("keeps every line of a multi-line verse inside the blockquote", () => {
    const poetry: Passage = { ...peter, verses: [{ number: 24, text: "第一行\n\n第二行" }] };
    expect(formatPassage(poetry, "blockquote").split("\n").slice(2)).toEqual([
      "> 第一行",
      ">",
      "> 第二行",
    ]);
  });
});

describe("showsTranslationName", () => {
  it("is hidden for Traditional Chinese", () => {
    expect(showsTranslationName("zh-TW")).toBe(false);
  });
});
