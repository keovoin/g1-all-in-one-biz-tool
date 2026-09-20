import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { TranslateService } from '@ngx-translate/core';
import { SuggestionHostService } from './suggestion-host.service';
import { ISlashCommandDeps } from './slash-menu.items';
export interface ISlashCommandExtensionDeps {
    host: SuggestionHostService;
    translate: TranslateService;
    commandDeps: ISlashCommandDeps;
}
export declare const slashSuggestionPluginKey: PluginKey<any>;
/**
 * Slash-command menu: `@tiptap/suggestion` with char `/` rendered through the
 * shared `SuggestionHostService` popup (spec 05 §6.4). Backspacing past the `/`
 * closes the menu (built into the suggestion plugin).
 */
export declare function createSlashCommandExtension(deps: ISlashCommandExtensionDeps): Extension<any, any>;
