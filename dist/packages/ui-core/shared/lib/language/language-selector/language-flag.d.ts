/**
 * Returns the flag asset URL for a language code, or null when no flag is vendored
 * (callers hide the image and fall back to the plain language name).
 *
 * @param code - Language code (e.g. 'en', 'pt-br').
 */
export declare function getLanguageFlagUrl(code: string): string | null;
