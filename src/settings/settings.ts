import type { InsertFormat } from "../core/formatter";

export interface BibleSettings {
  translationId: string;
  insertFormat: InsertFormat;
}

export const INSERT_FORMATS: readonly InsertFormat[] = ["blockquote", "reference", "plain"];

export const DEFAULT_SETTINGS: BibleSettings = {
  translationId: "cuv",
  insertFormat: "blockquote",
};

/** Merges persisted data over the defaults, ignoring anything malformed. */
export function sanitizeSettings(raw: unknown): BibleSettings {
  const data = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  const { translationId, insertFormat } = data;
  return {
    translationId:
      typeof translationId === "string" && translationId
        ? translationId
        : DEFAULT_SETTINGS.translationId,
    insertFormat:
      INSERT_FORMATS.find((format) => format === insertFormat) ?? DEFAULT_SETTINGS.insertFormat,
  };
}
