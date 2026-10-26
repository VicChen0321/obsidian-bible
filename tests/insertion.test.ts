import { describe, expect, it } from "vitest";
import { prepareInsertion } from "../src/ui/insertion";

describe("prepareInsertion", () => {
  it.each(["reference", "plain"] as const)("inserts %s inline unchanged", (format) => {
    expect(prepareInsertion("text", format, "before ")).toBe("text");
  });

  it("starts a blockquote on its own line when the cursor follows text", () => {
    expect(prepareInsertion("> q", "blockquote", "some text")).toBe("\n> q\n\n");
  });

  it("does not add a leading newline on an empty or blank line", () => {
    expect(prepareInsertion("> q", "blockquote", "")).toBe("> q\n\n");
    expect(prepareInsertion("> q", "blockquote", "   ")).toBe("> q\n\n");
  });
});
