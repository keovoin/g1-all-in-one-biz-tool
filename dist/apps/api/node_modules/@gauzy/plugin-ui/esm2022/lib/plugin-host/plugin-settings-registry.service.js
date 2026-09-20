import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Abstract storage interface for plugin settings persistence.
 * The app provides a concrete implementation (e.g. localStorage, API-backed).
 *
 * @example
 * ```ts
 * @Injectable({ providedIn: 'root' })
 * export class LocalStorageSettingsStorage implements IPluginSettingsStorage {
 *   async load(pluginId: string): Promise<Record<string, unknown>> {
 *     const raw = localStorage.getItem(`plugin-settings:${pluginId}`);
 *     return raw ? JSON.parse(raw) : {};
 *   }
 *   async save(pluginId: string, values: Record<string, unknown>): Promise<void> {
 *     localStorage.setItem(`plugin-settings:${pluginId}`, JSON.stringify(values));
 *   }
 * }
 * ```
 */
export class IPluginSettingsStorage {
}
/**
 * Registry for plugin settings.
 *
 * Collects settings schemas from plugin definitions and manages
 * settings values with optional persistence.
 *
 * @example
 * ```ts
 * // Register settings (done automatically by defineDeclarativePlugin)
 * settingsRegistry.register('my-plugin', schema);
 *
 * // Read a setting value
 * const autoStart = settingsRegistry.getValue<boolean>('my-plugin', 'autoStart');
 *
 * // Update a setting
 * settingsRegistry.setValue('my-plugin', 'autoStart', true);
 *
 * // Observe settings changes
 * settingsRegistry.getValues$('my-plugin').subscribe(values => {
 *   console.log('Settings changed:', values);
 * });
 * ```
 */
export class PluginSettingsRegistryService {
    _entries$ = new BehaviorSubject(new Map());
    _storage = null;
    /**
     * Sets the storage backend for persisting settings.
     * Call once during app initialization.
     */
    setStorage(storage) {
        this._storage = storage;
    }
    // ─── Registration ───────────────────────────────────────────────────────
    /**
     * Registers a plugin's settings schema.
     * Loads persisted values if a storage backend is configured.
     */
    async register(pluginId, schema) {
        // Build default values from fields
        const defaults = {};
        if (schema.fields) {
            for (const field of schema.fields) {
                if (field.defaultValue !== undefined) {
                    defaults[field.key] = field.defaultValue;
                }
            }
        }
        // Load persisted values
        let persisted = {};
        if (this._storage) {
            try {
                persisted = await this._storage.load(pluginId);
            }
            catch (error) {
                console.error(`[PluginSettings] Failed to load settings for '${pluginId}':`, error);
            }
        }
        const entry = {
            pluginId,
            schema,
            values: { ...defaults, ...persisted }
        };
        const entries = new Map(this._entries$.value);
        entries.set(pluginId, entry);
        this._entries$.next(entries);
    }
    /**
     * Unregisters a plugin's settings.
     */
    unregister(pluginId) {
        const entries = new Map(this._entries$.value);
        entries.delete(pluginId);
        this._entries$.next(entries);
    }
    // ─── Read ───────────────────────────────────────────────────────────────
    /**
     * Gets the settings entry for a plugin.
     */
    getEntry(pluginId) {
        const entry = this._entries$.value.get(pluginId);
        return entry ? { ...entry, values: { ...entry.values } } : undefined;
    }
    /**
     * Gets all settings values for a plugin.
     */
    getValues(pluginId) {
        const values = this._entries$.value.get(pluginId)?.values;
        return values ? { ...values } : {};
    }
    /**
     * Gets a single setting value.
     */
    getValue(pluginId, key) {
        return this.getValues(pluginId)[key];
    }
    /**
     * Gets a setting value with a default fallback.
     */
    getValueOrDefault(pluginId, key, defaultValue) {
        const value = this.getValue(pluginId, key);
        return value !== undefined ? value : defaultValue;
    }
    /**
     * Observable of all settings values for a plugin (reactive).
     */
    getValues$(pluginId) {
        return this._entries$.pipe(map((entries) => entries.get(pluginId)?.values ?? {}));
    }
    /**
     * Observable of a single setting value (reactive).
     */
    getValue$(pluginId, key) {
        return this.getValues$(pluginId).pipe(map((values) => values[key]));
    }
    /**
     * Gets the schema for a plugin.
     */
    getSchema(pluginId) {
        return this._entries$.value.get(pluginId)?.schema;
    }
    /**
     * Gets the field definitions for a plugin.
     */
    getFields(pluginId) {
        return this._entries$.value.get(pluginId)?.schema.fields ?? [];
    }
    // ─── Write ──────────────────────────────────────────────────────────────
    /**
     * Sets a single setting value and persists.
     */
    async setValue(pluginId, key, value) {
        const entries = new Map(this._entries$.value);
        const entry = entries.get(pluginId);
        if (!entry) {
            console.warn(`[PluginSettings] No settings registered for '${pluginId}'.`);
            return;
        }
        entry.values = { ...entry.values, [key]: value };
        entries.set(pluginId, { ...entry });
        this._entries$.next(entries);
        await this._persist(pluginId, entry.values);
    }
    /**
     * Sets multiple settings values at once and persists.
     */
    async setValues(pluginId, values) {
        const entries = new Map(this._entries$.value);
        const entry = entries.get(pluginId);
        if (!entry) {
            console.warn(`[PluginSettings] No settings registered for '${pluginId}'.`);
            return;
        }
        entry.values = { ...entry.values, ...values };
        entries.set(pluginId, { ...entry });
        this._entries$.next(entries);
        await this._persist(pluginId, entry.values);
    }
    /**
     * Resets all settings to defaults for a plugin and persists.
     */
    async resetToDefaults(pluginId) {
        const entry = this._entries$.value.get(pluginId);
        if (!entry)
            return;
        const defaults = {};
        if (entry.schema.fields) {
            for (const field of entry.schema.fields) {
                if (field.defaultValue !== undefined) {
                    defaults[field.key] = field.defaultValue;
                }
            }
        }
        const entries = new Map(this._entries$.value);
        entries.set(pluginId, { ...entry, values: defaults });
        this._entries$.next(entries);
        await this._persist(pluginId, defaults);
    }
    // ─── Query ──────────────────────────────────────────────────────────────
    /**
     * Returns all registered plugin settings entries.
     */
    getAll() {
        return Array.from(this._entries$.value.values());
    }
    /**
     * Observable of all registered plugin settings entries.
     */
    get all$() {
        return this._entries$.pipe(map((entries) => Array.from(entries.values())));
    }
    /**
     * Returns plugin IDs that have settings registered.
     */
    getPluginIds() {
        return Array.from(this._entries$.value.keys());
    }
    /**
     * Checks if a plugin has settings registered.
     */
    has(pluginId) {
        return this._entries$.value.has(pluginId);
    }
    // ─── Private ────────────────────────────────────────────────────────────
    async _persist(pluginId, values) {
        if (!this._storage)
            return;
        try {
            await this._storage.save(pluginId, values);
        }
        catch (error) {
            console.error(`[PluginSettings] Failed to save settings for '${pluginId}':`, error);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginSettingsRegistryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginSettingsRegistryService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginSettingsRegistryService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=plugin-settings-registry.service.js.map