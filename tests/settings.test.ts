import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, sanitizeSettings } from "../src/settings/settings";

describe("sanitizeSettings", () => {
  it.each([undefined, null, 42, "x", [], {}])("falls back to defaults for %j", (raw) => {
    expect(sanitizeSettings(raw)).toEqual(DEFAULT_SETTINGS);
  });

  it("keeps valid values", () => {
    expect(sanitizeSettings({ translationId: "sample", insertFormat: "plain" })).toEqual({
      translationId: "sample",
      insertFormat: "plain",
    });
  });

  it("replaces invalid values individually", () => {
    expect(sanitizeSettings({ translationId: "", insertFormat: "html" })).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings({ translationId: "sample", insertFormat: 3 })).toEqual({
      translationId: "sample",
      insertFormat: DEFAULT_SETTINGS.insertFormat,
    });
  });
});
