import { useState, useEffect, useRef } from 'react';
export function useObservable(observable$, initialValue) {
    // Try to read synchronous value from BehaviorSubject
    const syncValue = readBehaviorSubjectValue(observable$);
    const [value, setValue] = useState(syncValue !== undefined ? syncValue : initialValue);
    // Track the latest observable reference to avoid stale closure updates
    const observableRef = useRef(observable$);
    observableRef.current = observable$;
    useEffect(() => {
        // Re-read sync value in case observable$ changed between render and effect
        const currentSync = readBehaviorSubjectValue(observable$);
        if (currentSync !== undefined) {
            setValue(currentSync);
        }
        const subscription = observable$.subscribe({
            next: (val) => setValue(val),
            error: (err) => console.error('[useObservable] Subscription error:', err)
        });
        return () => subscription.unsubscribe();
    }, [observable$]);
    return value;
}
/**
 * Attempts to synchronously read the current value of a BehaviorSubject.
 * Returns `undefined` for plain Observables (no `.getValue()` method).
 */
function readBehaviorSubjectValue(obs) {
    if (obs && typeof obs.getValue === 'function') {
        try {
            return obs.getValue();
        }
        catch {
            return undefined;
        }
    }
    return undefined;
}
//# sourceMappingURL=use-observable.js.map