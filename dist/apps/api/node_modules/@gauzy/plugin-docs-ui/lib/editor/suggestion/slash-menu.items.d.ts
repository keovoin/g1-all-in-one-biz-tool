import { Editor, Range } from '@tiptap/core';
import { TranslateService } from '@ngx-translate/core';
import { ISuggestionItem } from './suggestion-list.component';
/** Side-effectful hooks a few slash commands need (owned by the editor component). */
export interface ISlashCommandDeps {
    /** Opens the hidden file picker (image or any allowed type) and routes into the upload pipeline. */
    openFilePicker(kind: 'image' | 'file'): void;
    /** Small URL-prompt dialog; resolves null on cancel. */
    promptUrl(titleKey: string): Promise<string | null>;
}
export interface ISlashCommand {
    id: string;
    /** i18n group key under DOCS.EDITOR.SLASH.GROUP_*. */
    groupKey: string;
    icon: string;
    pack?: 'eva' | 'fa';
    /** i18n title key under DOCS.EDITOR.SLASH.*. */
    titleKey: string;
    keywords: string[];
    action(editor: Editor, range: Range, deps: ISlashCommandDeps): void;
}
/**
 * Slash-menu command registry (spec 05 §6.4 — ids, groups, icons, keywords and
 * actions are normative). Every action starts with `deleteRange(range)`.
 */
export declare const SLASH_COMMANDS: ISlashCommand[];
/** Fuzzy filter on title + keywords, results grouped by group (spec 05 §6.4). */
export declare function filterSlashCommands(query: string, translate: TranslateService, deps: ISlashCommandDeps): ISuggestionItem<{
    command: ISlashCommand;
    deps: ISlashCommandDeps;
}>[];
