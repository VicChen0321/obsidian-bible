import { Modal, Notice, Platform, type App, type Editor } from "obsidian";
import type { BibleService } from "../core/bible-service";
import {
  formatPassage,
  formatReference,
  showsTranslationName,
  type InsertFormat,
} from "../core/formatter";
import type { Passage } from "../core/types";
import { INSERT_FORMATS } from "../settings/settings";
import { prepareInsertion } from "./insertion";

export interface LookupModalOptions {
  service: BibleService;
  translationId: string;
  insertFormat: InsertFormat;
  /** When set, Enter inserts the passage into this editor. */
  editor?: Editor | undefined;
  initialQuery?: string | undefined;
}

const FORMAT_LABELS: Record<InsertFormat, string> = {
  blockquote: "Blockquote",
  reference: "Reference only",
  plain: "Plain text",
};

export class LookupModal extends Modal {
  private inputEl!: HTMLInputElement;
  private resultEl!: HTMLElement;
  private insertButton: HTMLButtonElement | undefined;
  private passage: Passage | undefined;
  private format: InsertFormat;
  private requestId = 0;

  constructor(
    app: App,
    private readonly options: LookupModalOptions,
  ) {
    super(app);
    this.format = options.insertFormat;
  }

  override onOpen(): void {
    const { contentEl, options } = this;
    contentEl.addClass("obsidian-bible-modal");

    this.inputEl = contentEl.createEl("input", {
      type: "text",
      cls: "obsidian-bible-input",
      attr: {
        placeholder: "彼前 1:24-25",
        spellcheck: "false",
        autocomplete: "off",
        "aria-label": "Bible reference",
      },
    });
    this.inputEl.value = options.initialQuery ?? "";
    this.inputEl.addEventListener("input", () => void this.refresh());

    if (options.editor) {
      const optionsEl = contentEl.createDiv({ cls: "obsidian-bible-options" });
      optionsEl.createSpan({ text: "Insert as" });
      const select = optionsEl.createEl("select", { cls: "dropdown" });
      for (const format of INSERT_FORMATS) {
        select.createEl("option", { value: format, text: FORMAT_LABELS[format] });
      }
      select.value = this.format;
      select.addEventListener("change", () => {
        this.format = select.value as InsertFormat;
        this.inputEl.focus();
      });
      this.insertButton = optionsEl.createEl("button", {
        cls: "mod-cta obsidian-bible-insert",
        text: "Insert",
      });
      this.insertButton.disabled = true;
      this.insertButton.addEventListener("click", () => this.insert());
    }

    this.resultEl = contentEl.createDiv({ cls: "obsidian-bible-result" });
    if (!Platform.isMobile) {
      contentEl.createDiv({
        cls: "obsidian-bible-hint",
        text: options.editor ? "Enter to insert, Esc to close" : "Esc to close",
      });
    }

    // Enter must not fire while an IME (e.g. Zhuyin) is still composing text.
    this.scope.register([], "Enter", (evt) => {
      if (evt.isComposing) return true;
      this.insert();
      return false;
    });

    this.inputEl.focus();
    this.inputEl.select();
    void this.refresh();
  }

  override onClose(): void {
    this.requestId++;
    this.contentEl.empty();
  }

  private async refresh(): Promise<void> {
    const token = ++this.requestId;
    const query = this.inputEl.value;
    this.passage = undefined;
    if (this.insertButton) this.insertButton.disabled = true;

    if (!query.trim()) {
      this.showMessage("Type a reference such as 約 3:16 or 彼前 1:24-25.");
      return;
    }

    const result = await this.options.service.lookup(query, this.options.translationId);
    if (token !== this.requestId) return;

    if (!result.ok) {
      // A missing chapter just means the user is still typing.
      this.showMessage(result.error.message, result.error.code !== "missing-chapter");
      return;
    }
    this.passage = result.value;
    if (this.insertButton) this.insertButton.disabled = false;
    this.showPassage(result.value);
  }

  private showMessage(message: string, isError = false): void {
    this.resultEl.empty();
    this.resultEl.createDiv({
      cls: isError ? "obsidian-bible-message is-error" : "obsidian-bible-message",
      text: message,
    });
  }

  private showPassage(passage: Passage): void {
    const { reference, translation, verses } = passage;
    this.resultEl.empty();
    const label = formatReference(reference, translation.language, "full");
    this.resultEl.createDiv({
      cls: "obsidian-bible-heading",
      text: showsTranslationName(translation.language)
        ? `${label} · ${translation.abbreviation}`
        : label,
    });
    const body = this.resultEl.createDiv({ cls: "obsidian-bible-passage" });
    for (const verse of verses) {
      const label = verse.endNumber ? `${verse.number}-${verse.endNumber}` : `${verse.number}`;
      body.createSpan({ cls: "obsidian-bible-verse-number", text: label });
      body.createSpan({ text: verse.text });
    }
  }

  private insert(): void {
    const { editor } = this.options;
    if (!editor || !this.passage) return;

    // Insert after the selection so existing text is never replaced.
    const cursor = editor.getCursor("to");
    const before = editor.getLine(cursor.line).slice(0, cursor.ch);
    const text = prepareInsertion(formatPassage(this.passage, this.format), this.format, before);

    editor.replaceRange(text, cursor);
    editor.setCursor(editor.offsetToPos(editor.posToOffset(cursor) + text.length));
    new Notice("Scripture inserted");
    this.close();
  }
}
