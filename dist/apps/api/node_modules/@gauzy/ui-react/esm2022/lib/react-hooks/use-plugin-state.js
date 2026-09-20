import { useMemo, useCallback } from 'react';
import { PluginStateService } from '@gauzy/plugin-ui';
import { useInjector } from './use-injector';
import { useObservable } from './use-observable';
export function usePluginState(key, initialValue) {
    const stateService = useInjector(PluginStateService);
    // Initialize the key if an initial value is provided and the key doesn't exist yet
    useMemo(() => {
        if (initialValue !== undefined && !stateService.has(key)) {
            stateService.set(key, initialValue);
        }
    }, [stateService, key, initialValue]);
    // Subscribe to reactive updates
    const value$ = useMemo(() => stateService.select(key), [stateService, key]);
    const value = useObservable(value$, initialValue);
    // Setter — supports both direct value and updater function
    const setValue = useCallback((valueOrUpdater) => {
        if (typeof valueOrUpdater === 'function') {
            const current = stateService.get(key);
            stateService.set(key, valueOrUpdater(current));
        }
        else {
            stateService.set(key, valueOrUpdater);
        }
    }, [stateService, key]);
    return [value, setValue];
}
//# sourceMappingURL=use-plugin-state.js.map