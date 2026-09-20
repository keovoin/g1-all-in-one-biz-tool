import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter } from 'rxjs';
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
export class PluginStateService {
    _store = new Map();
    /** Keys that were explicitly set (not lazily created by select). */
    _explicitKeys = new Set();
    // ─── Write ────────────────────────────────────────────────────────────────
    /**
     * Set a value. Creates the key if it doesn't exist.
     */
    set(key, value) {
        this._explicitKeys.add(key);
        const subject = this._getOrCreate(key, value);
        subject.next(value);
    }
    /**
     * Update a value using a reducer function.
     *
     * @example
     * state.update<number>('my-plugin:count', n => (n ?? 0) + 1);
     */
    update(key, reducer) {
        const current = this.get(key);
        this.set(key, reducer(current));
    }
    // ─── Read ─────────────────────────────────────────────────────────────────
    /**
     * Get a snapshot value. Returns undefined if key not set.
     */
    get(key) {
        return this._store.get(key)?.getValue();
    }
    /**
     * Get a snapshot value with a fallback default.
     */
    getOrDefault(key, defaultValue) {
        const value = this.get(key);
        return value !== undefined ? value : defaultValue;
    }
    /**
     * Returns an Observable for a key that emits whenever the value changes.
     * Emits the current value immediately on subscribe.
     */
    select(key) {
        return this._getOrCreate(key, undefined).pipe(distinctUntilChanged());
    }
    /**
     * Returns an Observable that only emits defined (non-undefined) values.
     */
    selectDefined(key) {
        return this.select(key).pipe(filter((v) => v !== undefined), distinctUntilChanged());
    }
    // ─── Delete ───────────────────────────────────────────────────────────────
    /**
     * Delete a key and complete its subject.
     */
    delete(key) {
        const subject = this._store.get(key);
        if (subject) {
            subject.complete();
            this._store.delete(key);
        }
        this._explicitKeys.delete(key);
    }
    /**
     * Delete all keys that start with a given prefix.
     * Use this in ngOnPluginDestroy to clean up plugin state.
     *
     * @example
     * state.deleteByPrefix('my-plugin:');
     */
    deleteByPrefix(prefix) {
        for (const key of this._store.keys()) {
            if (key.startsWith(prefix)) {
                this.delete(key);
            }
        }
    }
    /**
     * Delete all state keys. Use with caution in production.
     */
    clear() {
        for (const subject of this._store.values()) {
            subject.complete();
        }
        this._store.clear();
        this._explicitKeys.clear();
    }
    // ─── Utilities ────────────────────────────────────────────────────────────
    /**
     * Returns true if the key has been explicitly set via `set()` or `update()`.
     * Keys lazily created by `select()` do not count.
     */
    has(key) {
        return this._explicitKeys.has(key);
    }
    /**
     * Returns all currently registered keys.
     */
    keys() {
        return Array.from(this._store.keys());
    }
    // ─── Internal ─────────────────────────────────────────────────────────────
    _getOrCreate(key, initialValue) {
        if (!this._store.has(key)) {
            this._store.set(key, new BehaviorSubject(initialValue));
        }
        return this._store.get(key);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginStateService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginStateService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginStateService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=plugin-state.service.js.map