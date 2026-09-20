import React, { createContext, useContext } from 'react';
import { PluginErrorBoundary } from './plugin-error-boundary';
/** @internal Used by useInjector and useBridgeContext */
export const NgBridgeContext = createContext(null);
/**
 * React Context provider that exposes Angular's Injector to child React components.
 * Used internally by ReactHostDirective and LazyReactHostDirective.
 *
 * Wraps children in a `PluginErrorBoundary` so that a crash in one React
 * component tree does not propagate to the Angular host or to other plugins.
 */
export function NgContextProvider({ injector, context = {}, children, pluginId, errorFallback, onError }) {
    const value = { injector, ...context };
    return React.createElement(NgBridgeContext.Provider, { value }, React.createElement(PluginErrorBoundary, { pluginId, fallback: errorFallback, onError }, children));
}
/**
 * Access the full bridge context (injector + any extra values from the context input).
 */
export function useBridgeContext() {
    const ctx = useContext(NgBridgeContext);
    if (!ctx) {
        throw new Error('useBridgeContext must be used within NgContextProvider');
    }
    return ctx;
}
//# sourceMappingURL=ng-react-context.js.map