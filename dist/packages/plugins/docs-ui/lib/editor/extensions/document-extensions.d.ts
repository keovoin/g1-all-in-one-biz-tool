import { Injector } from '@angular/core';
import { Extensions } from '@tiptap/core';
import { TranslateService } from '@ngx-translate/core';
import { EditorUploadService } from '../services/editor-upload.service';
import { SuggestionHostService } from '../suggestion/suggestion-host.service';
import { ISuggestionItem } from '../suggestion/suggestion-list.component';
import { ISlashCommandDeps } from '../suggestion/slash-menu.items';
/**
 * Trimmed lowlight language set (spec 05 §12 — registration dominates code-block
 * cost; adding a language is a code change with a bundle-budget review).
 *
 * The 16 grammars below are exactly the §12 list — never `lowlight/common` or the
 * full bundle. `xml` covers HTML; `plaintext` is the code block's default language.
 */
export declare const DOCS_LOWLIGHT_LANGUAGES: {
    typescript: import("highlight.js").LanguageFn;
    javascript: import("highlight.js").LanguageFn;
    xml: import("highlight.js").LanguageFn;
    css: import("highlight.js").LanguageFn;
    scss: import("highlight.js").LanguageFn;
    json: import("highlight.js").LanguageFn;
    bash: import("highlight.js").LanguageFn;
    sql: import("highlight.js").LanguageFn;
    python: import("highlight.js").LanguageFn;
    java: import("highlight.js").LanguageFn;
    csharp: import("highlight.js").LanguageFn;
    php: import("highlight.js").LanguageFn;
    yaml: import("highlight.js").LanguageFn;
    dockerfile: import("highlight.js").LanguageFn;
    markdown: import("highlight.js").LanguageFn;
    plaintext: import("highlight.js").LanguageFn;
};
export declare function createDocsLowlight(): {
    highlight: (language: string, value: string, options?: Readonly<import("lowlight").Options> | null | undefined) => import("hast").Root;
    highlightAuto: (value: string, options?: Readonly<import("lowlight").AutoOptions> | null | undefined) => import("hast").Root;
    listLanguages: () => Array<string>;
    register: {
        (grammars: Readonly<Record<string, import("highlight.js").LanguageFn>>): undefined;
        (name: string, grammar: import("highlight.js").LanguageFn): undefined;
    };
    registerAlias: {
        (aliases: Readonly<Record<string, ReadonlyArray<string> | string>>): undefined;
        (language: string, alias: ReadonlyArray<string> | string): undefined;
    };
    registered: (aliasOrName: string) => boolean;
};
export interface IDocumentEditorExtensionDeps {
    injector: Injector;
    translate: TranslateService;
    suggestionHost: SuggestionHostService;
    uploadService: EditorUploadService;
    slashCommandDeps: ISlashCommandDeps;
    /** ToC anchors sink (feeds the page's ToC side panel). */
    onTocUpdate(anchors: unknown[]): void;
    /** A block's comment gutter marker was activated — opens that thread in the rail (spec 05 §8). */
    onOpenCommentThread?(blockId: string): void;
    /** Realtime co-editing flag — MUST disable StarterKit undoRedo when true (spec 05 §11). */
    collab?: boolean;
}
/**
 * Schema-only extension set for `@tiptap/static-renderer` (read-only render,
 * version previews, print) — no menus, no suggestions, no node views, no DOM
 * plugins in the read path (spec 05 §9.1).
 */
export declare function createStaticExtensions(): Extensions;
/**
 * Full Tier-2 extension set for `gz-document-editor` (spec 05 §5 is normative
 * for every configuration here).
 */
export declare function createDocumentEditorExtensions(deps: IDocumentEditorExtensionDeps): Extensions;
/** Emoji suggestion items for the shared popup (`:` trigger — spec 05 §5). */
export declare function filterEmojiItems(query: string): ISuggestionItem<{
    name: string;
}>[];
