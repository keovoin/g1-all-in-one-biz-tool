import { useMemo } from 'react';
import { PluginSettingsRegistryService } from '@gauzy/plugin-ui';
import { useInjector } from './use-injector';
import { useObservable } from './use-observable';
/**
 * React hook for reading plugin settings.
 *
 * Returns the current settings values for a plugin, updated reactively
 * when settings change.
 *
 * @param pluginId The plugin ID to read settings for.
 * @returns The current settings values as a key-value record.
 *
 * @example
 * ```tsx
 * function TimeTrackerSettings() {
 *   const settings = usePluginSettings('time-tracker');
 *   const autoStart = settings['autoStart'] as boolean ?? false;
 *   const interval = settings['interval'] as number ?? 10;
 *
 *   return (
 *     <div>
 *       <p>Auto-start: {autoStart ? 'Yes' : 'No'}</p>
 *       <p>Interval: {interval}s</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePluginSettings(pluginId) {
    const settingsRegistry = useInjector(PluginSettingsRegistryService);
    const values$ = useMemo(() => settingsRegistry.getValues$(pluginId), [settingsRegistry, pluginId]);
    return useObservable(values$, {}) ?? {};
}
export function usePluginSetting(pluginId, key, defaultValue) {
    const settingsRegistry = useInjector(PluginSettingsRegistryService);
    const value$ = useMemo(() => settingsRegistry.getValue$(pluginId, key), [settingsRegistry, pluginId, key]);
    return useObservable(value$, defaultValue) ?? defaultValue;
}
//# sourceMappingURL=use-plugin-settings.js.map