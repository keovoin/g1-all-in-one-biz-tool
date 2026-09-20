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
export function wrapTranslationsInNamespace(namespace, data) {
    return { [namespace]: data };
}
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
export function namespaceTranslations(namespace, translations) {
    const result = {};
    for (const [lang, data] of Object.entries(translations)) {
        result[lang] = wrapTranslationsInNamespace(namespace, data);
    }
    return result;
}
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
export class NamespacedTranslateHelper {
    _delegate;
    _namespace;
    constructor(_delegate, _namespace) {
        this._delegate = _delegate;
        this._namespace = _namespace;
    }
    /** The namespace prefix used by this helper. */
    get namespace() {
        return this._namespace;
    }
    /**
     * Prefixes a key with the namespace, unless it already starts with the namespace.
     */
    _prefixKey(key) {
        if (key.startsWith(this._namespace + '.')) {
            return key;
        }
        return `${this._namespace}.${key}`;
    }
    setTranslation(lang, translations, shouldMerge) {
        // Wrap translations under namespace before delegating.
        // Always force merge so that plugin translations are additive.
        // Even an explicit shouldMerge=false would replace the entire language
        // dictionary, wiping core and other plugins' translations.
        if (shouldMerge === false) {
            console.warn(`[NamespacedTranslateHelper] Ignoring shouldMerge=false for namespace '${this._namespace}' — ` +
                `plugin translations are always merged to prevent overwriting other plugins' translations.`);
        }
        const wrapped = wrapTranslationsInNamespace(this._namespace, translations);
        this._delegate.setTranslation(lang, wrapped, true);
    }
    getTranslations(lang) {
        const all = this._delegate.getTranslations(lang);
        if (!all)
            return undefined;
        return all[this._namespace];
    }
    getCurrentLang() {
        return this._delegate.getCurrentLang();
    }
    getFallbackLang() {
        return this._delegate.getFallbackLang();
    }
    instant(key, params) {
        return this._delegate.instant(this._prefixKey(key), params);
    }
    stream(key, params) {
        return this._delegate.stream(this._prefixKey(key), params);
    }
    get onLangChange() {
        return this._delegate.onLangChange;
    }
}
/**
 * Creates a namespaced translate helper for a plugin.
 *
 * @param translateService The root translate service.
 * @param namespace The plugin's translation namespace.
 * @returns A `NamespacedTranslateHelper` that auto-prefixes keys.
 */
export function createNamespacedTranslateHelper(translateService, namespace) {
    return new NamespacedTranslateHelper(translateService, namespace);
}
//# sourceMappingURL=plugin-i18n-namespace.js.map