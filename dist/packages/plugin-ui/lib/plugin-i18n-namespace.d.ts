import { Observable } from 'rxjs';
import type { IPluginTranslateService } from './plugin-ui.helper';
/**
 * Wraps translation data in a namespace prefix.
 *
 * Given namespace `'MY_PLUGIN'` and data `{ TITLE: 'Hello' }`, produces
 * `{ MY_PLUGIN: { TITLE: 'Hello' } }`.
 *
 * @param namespace The namespace prefix (e.g. 'MY_PLUGIN', 'TIME_TRACKER').
 * @param data Raw translation data.
 * @returns Wrapped translation data with the namespace as root key.
 */
export declare function wrapTranslationsInNamespace(namespace: string, data: Record<string, any>): Record<string, any>;
/**
 * Applies namespace wrapping to all languages in a plugin's translations map.
 *
 * @param namespace The namespace prefix.
 * @param translations Plugin translations keyed by language code.
 * @returns Namespaced translations keyed by language code.
 *
 * @example
 * ```ts
 * const raw = {
 *   en: { TITLE: 'Hello', DESC: 'World' },
 *   fr: { TITLE: 'Bonjour', DESC: 'Monde' }
 * };
 * const ns = namespaceTranslations('MY_PLUGIN', raw);
 * // => { en: { MY_PLUGIN: { TITLE: 'Hello', DESC: 'World' } }, fr: { MY_PLUGIN: { ... } } }
 * ```
 */
export declare function namespaceTranslations(namespace: string, translations: Record<string, Record<string, any>>): Record<string, Record<string, any>>;
/**
 * A translate service wrapper that auto-prefixes keys with a plugin namespace.
 *
 * When a plugin declares `translationNamespace: 'MY_PLUGIN'`, it receives a
 * `NamespacedTranslateHelper` so that `instant('TITLE')` resolves to
 * `instant('MY_PLUGIN.TITLE')` — preventing key collisions with core or
 * other plugins' translations.
 *
 * @example
 * ```ts
 * // Plugin definition:
 * defineDeclarativePlugin('my-plugin', {
 *   translationNamespace: 'MY_PLUGIN',
 *   translations: {
 *     en: { TITLE: 'Dashboard', DESCRIPTION: 'Plugin dashboard' }
 *   }
 * });
 *
 * // At runtime, translations are stored as:
 * // { MY_PLUGIN: { TITLE: 'Dashboard', DESCRIPTION: 'Plugin dashboard' } }
 *
 * // Using the helper:
 * const ns = new NamespacedTranslateHelper(translateService, 'MY_PLUGIN');
 * ns.instant('TITLE');       // → resolves 'MY_PLUGIN.TITLE' → 'Dashboard'
 * ns.instant('DESCRIPTION'); // → resolves 'MY_PLUGIN.DESCRIPTION' → 'Plugin dashboard'
 *
 * // Full keys still work:
 * ns.instant('MY_PLUGIN.TITLE'); // → 'MY_PLUGIN.TITLE' (not double-prefixed)
 * ```
 */
export declare class NamespacedTranslateHelper implements IPluginTranslateService {
    private readonly _delegate;
    private readonly _namespace;
    constructor(_delegate: IPluginTranslateService, _namespace: string);
    /** The namespace prefix used by this helper. */
    get namespace(): string;
    /**
     * Prefixes a key with the namespace, unless it already starts with the namespace.
     */
    private _prefixKey;
    setTranslation(lang: string, translations: Record<string, any>, shouldMerge?: boolean): void;
    getTranslations(lang: string): Readonly<Record<string, any>> | undefined;
    getCurrentLang(): string;
    getFallbackLang(): string | null;
    instant(key: string, params?: Record<string, unknown>): string;
    stream(key: string, params?: Record<string, unknown>): Observable<string>;
    get onLangChange(): Observable<{
        lang: string;
    }>;
}
/**
 * Creates a namespaced translate helper for a plugin.
 *
 * @param translateService The root translate service.
 * @param namespace The plugin's translation namespace.
 * @returns A `NamespacedTranslateHelper` that auto-prefixes keys.
 */
export declare function createNamespacedTranslateHelper(translateService: IPluginTranslateService, namespace: string): NamespacedTranslateHelper;
