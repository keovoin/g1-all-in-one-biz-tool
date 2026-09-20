import { useMemo, useCallback } from 'react';
import { of } from 'rxjs';
import { PLUGIN_TRANSLATE_SERVICE } from '@gauzy/plugin-ui';
import { useInjector } from './use-injector';
import { useObservable } from './use-observable';
/** No-op observable that never emits — used when translate service is unavailable. */
const EMPTY_LANG$ = of();
const EMPTY_STREAM$ = of();
export function useTranslation(key, params) {
    const injector = useInjector();
    const translateService = useMemo(() => {
        try {
            return injector.get(PLUGIN_TRANSLATE_SERVICE, null);
        }
        catch {
            return null;
        }
    }, [injector]);
    // Subscribe to language changes to trigger re-render on language switch.
    // Always called unconditionally (React rules of hooks).
    const langChange$ = useMemo(() => translateService?.onLangChange ?? EMPTY_LANG$, [translateService]);
    const langEvent = useObservable(langChange$);
    const lang = langEvent?.lang ?? translateService?.getCurrentLang() ?? '';
    // Subscribe to a single-key translation stream.
    // When no key is provided, uses a no-op stream (hook must always be called).
    const stream$ = useMemo(() => (key !== undefined && translateService ? translateService.stream(key, params) : EMPTY_STREAM$), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translateService, key, JSON.stringify(params)]);
    const initialTranslation = key !== undefined && translateService ? translateService.instant(key, params) : undefined;
    const streamValue = useObservable(stream$, initialTranslation);
    // Multi-key `t()` function — re-created when language changes so
    // React components using `t()` in JSX re-render with updated text.
    const t = useCallback((k, p) => {
        if (!translateService)
            return k;
        return translateService.instant(k, p);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translateService, lang]);
    // Single-key overload → return translated string
    if (key !== undefined) {
        return streamValue ?? key;
    }
    // Object overload → return { t, lang }
    return { t, lang };
}
//# sourceMappingURL=use-translation.js.map