import { describe, expect, it } from "vitest";
import { createInMemorySource, LocalProvider } from "../src/providers/local-provider";
import { CUV, SAMPLE } from "./fixtures";

describe("LocalProvider", () => {
  const provider = new LocalProvider([
    createInMemorySource(SAMPLE, { GEN: [["a", "b"], ["c"]] }),
    createInMemorySource(CUV, {}),
  ]);

  it("returns chapter verses", async () => {
    expect(await provider.getChapter("sample", "GEN", 2)).toEqual(["c"]);
  });

  it("returns undefined for missing books and chapters", async () => {
    expect(await provider.getChapter("sample", "EXO", 1)).toBeUndefined();
    expect(await provider.getChapter("sample", "GEN", 3)).toBeUndefined();
  });

  it("throws for unknown translations", async () => {
    await expect(provider.getChapter("nope", "GEN", 1)).rejects.toThrow("Unknown translation");
  });

  it("rejects duplicate translation ids", () => {
    expect(
      () => new LocalProvider([createInMemorySource(SAMPLE, {}), createInMemorySource(SAMPLE, {})]),
    ).toThrow("Duplicate");
  });
});
