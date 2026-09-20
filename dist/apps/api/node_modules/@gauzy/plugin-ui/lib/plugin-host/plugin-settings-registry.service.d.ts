import { Observable } from 'rxjs';
import type { PluginSettingsSchema, PluginSettingField } from '../plugin-ui.types';
import * as i0 from "@angular/core";
/**
 * Registered plugin settings entry.
 */
export interface PluginSettingsEntry {
    /** Plugin ID. */
    pluginId: string;
    /** Settings schema from the plugin definition. */
    schema: PluginSettingsSchema;
    /** Current settings values (persisted via PluginSettingsStorageService). */
    values: Record<string, unknown>;
}
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
export declare abstract class IPluginSettingsStorage {
    /** Load settings values for a plugin. Returns empty object if none saved. */
    abstract load(pluginId: string): Promise<Record<string, unknown>>;
    /** Persist settings values for a plugin. */
    abstract save(pluginId: string, values: Record<string, unknown>): Promise<void>;
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
export declare class PluginSettingsRegistryService {
    private readonly _entries$;
    private _storage;
    /**
     * Sets the storage backend for persisting settings.
     * Call once during app initialization.
     */
    setStorage(storage: IPluginSettingsStorage): void;
    /**
     * Registers a plugin's settings schema.
     * Loads persisted values if a storage backend is configured.
     */
    register(pluginId: string, schema: PluginSettingsSchema): Promise<void>;
    /**
     * Unregisters a plugin's settings.
     */
    unregister(pluginId: string): void;
    /**
     * Gets the settings entry for a plugin.
     */
    getEntry(pluginId: string): Readonly<PluginSettingsEntry> | undefined;
    /**
     * Gets all settings values for a plugin.
     */
    getValues(pluginId: string): Readonly<Record<string, unknown>>;
    /**
     * Gets a single setting value.
     */
    getValue<T>(pluginId: string, key: string): T | undefined;
    /**
     * Gets a setting value with a default fallback.
     */
    getValueOrDefault<T>(pluginId: string, key: string, defaultValue: T): T;
    /**
     * Observable of all settings values for a plugin (reactive).
     */
    getValues$(pluginId: string): Observable<Record<string, unknown>>;
    /**
     * Observable of a single setting value (reactive).
     */
    getValue$<T>(pluginId: string, key: string): Observable<T | undefined>;
    /**
     * Gets the schema for a plugin.
     */
    getSchema(pluginId: string): PluginSettingsSchema | undefined;
    /**
     * Gets the field definitions for a plugin.
     */
    getFields(pluginId: string): PluginSettingField[];
    /**
     * Sets a single setting value and persists.
     */
    setValue(pluginId: string, key: string, value: unknown): Promise<void>;
    /**
     * Sets multiple settings values at once and persists.
     */
    setValues(pluginId: string, values: Record<string, unknown>): Promise<void>;
    /**
     * Resets all settings to defaults for a plugin and persists.
     */
    resetToDefaults(pluginId: string): Promise<void>;
    /**
     * Returns all registered plugin settings entries.
     */
    getAll(): PluginSettingsEntry[];
    /**
     * Observable of all registered plugin settings entries.
     */
    get all$(): Observable<PluginSettingsEntry[]>;
    /**
     * Returns plugin IDs that have settings registered.
     */
    getPluginIds(): string[];
    /**
     * Checks if a plugin has settings registered.
     */
    has(pluginId: string): boolean;
    private _persist;
    static ɵfac: i0.ɵɵFactoryDeclaration<PluginSettingsRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PluginSettingsRegistryService>;
}
