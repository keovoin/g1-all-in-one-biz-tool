/**
 * React hook for reactive translations.
 *
 * Returns `{ t, lang }` where:
 * - `t(key, params?)` — translates a key using the current language.
 * - `lang` — the current language code (re-renders on language change).
 *
 * Translations are resolved via `PLUGIN_TRANSLATE_SERVICE` (backed by
 * `@ngx-translate/core` under the hood). When the user switches language,
 * the component re-renders with updated translations automatically.
 *
 * @example Basic usage
 * ```tsx
 * function MyWidget() {
 *   const { t } = useTranslation();
 *   return <h1>{t('DASHBOARD_PAGE.TITLE')}</h1>;
 * }
 * ```
 *
 * @example With params
 * ```tsx
 * const { t } = useTranslation();
 * return <p>{t('GREETING', { name: 'Alice' })}</p>;
 * // en.json: { "GREETING": "Hello, {{name}}!" }
 * ```
 *
 * @example Single key (convenience overload)
 * ```tsx
 * const title = useTranslation('DASHBOARD_PAGE.TITLE');
 * return <h1>{title}</h1>;
 * ```
 */
export declare function useTranslation(): {
    t: (key: string, params?: Record<string, unknown>) => string;
    lang: string;
};
export declare function useTranslation(key: string, params?: Record<string, unknown>): string;
