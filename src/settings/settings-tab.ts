import { PluginSettingTab, Setting, type App } from "obsidian";
import type { InsertFormat } from "../core/formatter";
import type ObsidianBiblePlugin from "../main";
import { INSERT_FORMATS } from "./settings";

const FORMAT_LABELS: Record<InsertFormat, string> = {
  blockquote: "Blockquote with scripture",
  reference: "Reference only",
  plain: "Plain text",
};

export class BibleSettingTab extends PluginSettingTab {
  constructor(
    app: App,
    private readonly plugin: ObsidianBiblePlugin,
  ) {
    super(app, plugin);
  }

  override display(): void {
    const { containerEl } = this;
    containerEl.empty();

    const translationSetting = new Setting(containerEl)
      .setName("Bible translation")
      .setDesc("Translation used for lookups and insertion.");

    void this.plugin.service.listTranslations().then((translations) => {
      translationSetting.addDropdown((dropdown) => {
        for (const translation of translations) {
          dropdown.addOption(translation.id, translation.name);
        }
        dropdown
          .setValue(this.plugin.resolveTranslationId(translations))
          .onChange(async (value) => {
            this.plugin.settings.translationId = value;
            await this.plugin.saveSettings();
          });
      });
    });

    new Setting(containerEl)
      .setName("Default insert format")
      .setDesc("Format used when inserting scripture. You can change it per insertion.")
      .addDropdown((dropdown) => {
        for (const format of INSERT_FORMATS) dropdown.addOption(format, FORMAT_LABELS[format]);
        dropdown.setValue(this.plugin.settings.insertFormat).onChange(async (value) => {
          this.plugin.settings.insertFormat = value as InsertFormat;
          await this.plugin.saveSettings();
        });
      });
  }
}
