import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Reactive, plugin-scoped state store.
 *
 * Provides a simple key/value store backed by BehaviorSubjects so both
 * Angular components (via Observables) and React components (via the
 * usePluginState() hook in @gauzy/plugin-ui) can reactively
 * consume and update shared state.
 *
 * Keys are arbitrary strings. Convention: prefix with your plugin id
 * to avoid collisions: `'my-plugin:counter'`.
 *
 * @example Angular:
 * ```ts
 * const state = inject(PluginStateService);
 *
 * // Write
 * state.set('my-plugin:count', 42);
 *
 * // Read (snapshot)
 * const value = state.get<number>('my-plugin:count');
 *
 * // Subscribe (reactive)
 * state.select<number>('my-plugin:count').subscribe(v => console.log(v));
 * ```
 *
 * @example React (via hook):
 * ```tsx
 * const [count, setCount] = usePluginState<number>('my-plugin:count', 0);
 * ```
 */
export declare class PluginStateService {
    private readonly _store;
    /** Keys that were explicitly set (not lazily created by select). */
    private readonly _explicitKeys;
    /**
     * Set a value. Creates the key if it doesn't exist.
     */
    set<T>(key: string, value: T): void;
    /**
     * Update a value using a reducer function.
     *
     * @example
     * state.update<number>('my-plugin:count', n => (n ?? 0) + 1);
     */
    update<T>(key: string, reducer: (current: T | undefined) => T): void;
    /**
     * Get a snapshot value. Returns undefined if key not set.
     */
    get<T>(key: string): T | undefined;
    /**
     * Get a snapshot value with a fallback default.
     */
    getOrDefault<T>(key: string, defaultValue: T): T;
    /**
     * Returns an Observable for a key that emits whenever the value changes.
     * Emits the current value immediately on subscribe.
     */
    select<T>(key: string): Observable<T | undefined>;
    /**
     * Returns an Observable that only emits defined (non-undefined) values.
     */
    selectDefined<T>(key: string): Observable<T>;
    /**
     * Delete a key and complete its subject.
     */
    delete(key: string): void;
    /**
     * Delete all keys that start with a given prefix.
     * Use this in ngOnPluginDestroy to clean up plugin state.
     *
     * @example
     * state.deleteByPrefix('my-plugin:');
     */
    deleteByPrefix(prefix: string): void;
    /**
     * Delete all state keys. Use with caution in production.
     */
    clear(): void;
    /**
     * Returns true if the key has been explicitly set via `set()` or `update()`.
     * Keys lazily created by `select()` do not count.
     */
    has(key: string): boolean;
    /**
     * Returns all currently registered keys.
     */
    keys(): string[];
    private _getOrCreate;
    static ɵfac: i0.ɵɵFactoryDeclaration<PluginStateService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PluginStateService>;
}
