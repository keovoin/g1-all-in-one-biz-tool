import { InjectionToken } from '@angular/core';
/**
 * InjectionToken for the plugin host API.
 *
 * The host application provides this in the root module:
 * ```ts
 * { provide: PLUGIN_HOST_API, useClass: PluginHostService }
 * ```
 */
export const PLUGIN_HOST_API = new InjectionToken('PLUGIN_HOST_API');
//# sourceMappingURL=plugin-host.interface.js.map