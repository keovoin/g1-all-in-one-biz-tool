import React from 'react';
import type { Injector } from '@angular/core';
import { type PluginErrorInfo } from './plugin-error-boundary';
/**
 * Bridge context passed from Angular host to React components.
 * Exposes the Angular injector plus any optional extra values.
 */
export interface NgReactBridgeContext {
    injector: Injector;
    [key: string]: unknown;
}
/** @internal Used by useInjector and useBridgeContext */
export declare const NgBridgeContext: React.Context<NgReactBridgeContext | null>;
export interface NgContextProviderProps {
    injector: Injector;
    /** Optional extra values merged with injector (e.g. config, feature flags) */
    context?: Record<string, unknown>;
    /** Child components to render within the provider */
    children?: React.ReactNode;
    /** Plugin ID for scoped error reporting. */
    pluginId?: string;
    /** Custom fallback UI for error boundary. */
    errorFallback?: React.ReactNode | ((info: PluginErrorInfo, retry: () => void) => React.ReactNode);
    /** Called when a React error is caught. */
    onError?: (info: PluginErrorInfo) => void;
}
/**
 * React Context provider that exposes Angular's Injector to child React components.
 * Used internally by ReactHostDirective and LazyReactHostDirective.
 *
 * Wraps children in a `PluginErrorBoundary` so that a crash in one React
 * component tree does not propagate to the Angular host or to other plugins.
 */
export declare function NgContextProvider({ injector, context, children, pluginId, errorFallback, onError }: NgContextProviderProps): React.FunctionComponentElement<React.ProviderProps<NgReactBridgeContext | null>>;
/**
 * Access the full bridge context (injector + any extra values from the context input).
 */
export declare function useBridgeContext(): NgReactBridgeContext;
