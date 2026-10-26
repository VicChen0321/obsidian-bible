import { describe, expect, it } from "vitest";
import { parseReference } from "../src/core/reference-parser";
import type { BibleErrorCode, BibleReference } from "../src/core/types";

const verse = (book: BibleReference["book"], chapter: number, start: number, end = start) =>
  ({ book, chapter, verses: { start, end } }) satisfies BibleReference;

describe("parseReference: valid input", () => {
  it.each<[string, BibleReference]>([
    ["彼前 1:24-25", verse("1PE", 1, 24, 25)],
    ["彼得前書 1:24-25", verse("1PE", 1, 24, 25)],
    ["約 3:16", verse("JHN", 3, 16)],
    ["創 1:1-3", verse("GEN", 1, 1, 3)],
    ["約3:16", verse("JHN", 3, 16)],
    ["約翰福音3", { book: "JHN", chapter: 3 }],
    ["約翰福音 3", { book: "JHN", chapter: 3 }],
    ["約壹 4:8", verse("1JN", 4, 8)],
    ["約一 4:8", verse("1JN", 4, 8)],
    ["詩 119:176", verse("PSA", 119, 176)],
    ["詩篇 23", { book: "PSA", chapter: 23 }],
    // a range of one verse collapses to a single verse
    ["約 3:16-16", verse("JHN", 3, 16)],
  ])("parses %s", (input, expected) => {
    expect(parseReference(input)).toEqual({ ok: true, value: expected });
  });

  it.each<[string, BibleReference]>([
    ["  約   3 : 16  ", verse("JHN", 3, 16)],
    ["約\t3:16", verse("JHN", 3, 16)],
    ["約　3:16", verse("JHN", 3, 16)],
    ["約　3：16", verse("JHN", 3, 16)],
    ["約３：１６", verse("JHN", 3, 16)],
    ["約 3:16－18", verse("JHN", 3, 16, 18)],
    ["約 3:16～18", verse("JHN", 3, 16, 18)],
    ["約 3:16–18", verse("JHN", 3, 16, 18)],
    ["約 3:16—18", verse("JHN", 3, 16, 18)],
    ["約 3:16 - 18", verse("JHN", 3, 16, 18)],
    ["約翰福音 3章16節", verse("JHN", 3, 16)],
    ["約翰福音 3章16-18節", verse("JHN", 3, 16, 18)],
    ["約翰福音 3章", { book: "JHN", chapter: 3 }],
    ["約翰福音 3章16节", verse("JHN", 3, 16)],
  ])("normalizes whitespace and punctuation in %j", (input, expected) => {
    expect(parseReference(input)).toEqual({ ok: true, value: expected });
  });

  it("treats a bare number in a single-chapter book as a verse", () => {
    expect(parseReference("猶 5")).toEqual({ ok: true, value: verse("JUD", 1, 5) });
    expect(parseReference("猶 3-5")).toEqual({ ok: true, value: verse("JUD", 1, 3, 5) });
    expect(parseReference("猶 1:5")).toEqual({ ok: true, value: verse("JUD", 1, 5) });
    expect(parseReference("約貳 5")).toEqual({ ok: true, value: verse("2JN", 1, 5) });
  });

  it("gives the same result for every name of a book", () => {
    const results = ["彼前 1:24-25", "彼得前書 1:24-25", "彼前1：24－25"].map(parseReference);
    expect(results[1]).toEqual(results[0]);
    expect(results[2]).toEqual(results[0]);
  });
});

describe("parseReference: invalid input", () => {
  it.each<[string, BibleErrorCode]>([
    ["", "empty"],
    ["   ", "empty"],
    ["3:16", "missing-book"],
    ["耶穌 3:16", "unknown-book"],
    ["彼 1:1", "unknown-book"],
    ["John 3:16", "unknown-book"],
    ["約", "missing-chapter"],
    ["彼前", "missing-chapter"],
    ["約 0", "invalid-chapter"],
    ["約 22", "invalid-chapter"],
    ["俄 2:1", "invalid-chapter"],
    ["猶 1:0", "invalid-verse"],
    ["約 3:0", "invalid-verse"],
    ["約 3:177", "invalid-verse"],
    ["約 3:18-16", "invalid-range"],
    ["約 3:16,18", "invalid-syntax"],
    ["約 3:16:18", "invalid-syntax"],
    ["約 3:16-", "invalid-syntax"],
    ["約 3:16-4:2", "unsupported-range"],
    ["約 3:16-18:2", "unsupported-range"],
    ["約 3-4", "unsupported-range"],
  ])("rejects %j with %s", (input, code) => {
    const result = parseReference(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe(code);
      expect(result.error.message).not.toBe("");
    }
  });
});
