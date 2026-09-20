import { type Injector } from '@angular/core';
/**
 * Translate one key, falling back to the given English text.
 *
 * The fallback is not decoration: `TranslateService.instant()` echoes the key
 * back when the bundle for the active language has not loaded yet (the panel
 * can mount before the first HTTP load resolves), and a control labelled
 * `AI_ASSISTANT.HISTORY` is worse than one labelled `History`.
 */
export type ChatTranslate = (key: string, fallback: string) => string;
/**
 * Fallback-only translator, for the presentational components when they are
 * rendered outside the panel (the playground harness, tests, Storybook-style
 * usage) and no Angular injector is in reach.
 */
export declare const passthroughChatTranslate: ChatTranslate;
/**
 * useChatTranslate
 *
 * Bridges ngx-translate into the React chat panel, mirroring what the
 * `| translate` pipe does on the Angular side: read the string now, and
 * re-render when the active language changes or a bundle finishes loading.
 *
 * The panel's chrome strings live in the CORE bundle under `AI_ASSISTANT.*`
 * — the one place all 14 locales exist — rather than in this plugin's own
 * `AI_CHAT_UI` namespace, which ships English only and falls every other
 * locale back to it.
 *
 * @param injector - The host Angular injector supplied by the React bridge.
 * @returns A `t(key, fallback)` function that is stable per language.
 */
export declare function useChatTranslate(injector: Injector): ChatTranslate;
