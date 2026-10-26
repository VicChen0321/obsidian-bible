import { Plugin, type Editor } from "obsidian";
import { BibleService } from "./core/bible-service";
import type { TranslationInfo } from "./core/types";
import { createBundledProvider } from "./data";
import { DEFAULT_SETTINGS, sanitizeSettings, type BibleSettings } from "./settings/settings";
import { BibleSettingTab } from "./settings/settings-tab";
import { LookupModal } from "./ui/lookup-modal";

export default class ObsidianBiblePlugin extends Plugin {
  override settings: BibleSettings = { ...DEFAULT_SETTINGS };
  readonly service = new BibleService(createBundledProvider());

  override async onload(): Promise<void> {
    this.settings = sanitizeSettings(await this.loadData());

    this.addCommand({
      id: "lookup-verse",
      name: "Lookup verse",
      callback: () => void this.openLookup({ editor: this.app.workspace.activeEditor?.editor }),
    });

    this.addCommand({
      id: "insert-verse",
      name: "Insert verse",
      editorCallback: (editor) => void this.openLookup({ editor }),
    });

    this.addCommand({
      id: "lookup-selected-reference",
      name: "Lookup selected reference",
      editorCallback: (editor) =>
        void this.openLookup({ editor, initialQuery: editor.getSelection().trim() }),
    });

    this.addSettingTab(new BibleSettingTab(this.app, this));
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  /** The configured translation, or the first available one if it is no longer offered. */
  resolveTranslationId(translations: readonly TranslationInfo[]): string {
    const configured = translations.find((t) => t.id === this.settings.translationId);
    return (configured ?? translations[0])?.id ?? this.settings.translationId;
  }

  private async openLookup(options: {
    editor?: Editor | undefined;
    initialQuery?: string | undefined;
  }): Promise<void> {
    const translationId = this.resolveTranslationId(await this.service.listTranslations());
    new LookupModal(this.app, {
      service: this.service,
      translationId,
      insertFormat: this.settings.insertFormat,
      ...options,
    }).open();
  }
}
