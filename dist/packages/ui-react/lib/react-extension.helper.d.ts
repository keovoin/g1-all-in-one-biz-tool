import { Type, Injector } from '@angular/core';
import React from 'react';
/**
 * Lifecycle context for React extensions.
 */
export interface ReactExtensionLifecycleContext {
    injector: Injector;
    extension: ReactExtensionDefinition;
    slotId: string;
    data?: Record<string, unknown>;
}
/**
 * Visibility context for React extensions.
 */
export interface ReactExtensionVisibilityContext {
    injector: Injector;
    user?: unknown;
    organization?: unknown;
    data?: Record<string, unknown>;
}
/**
 * Wrapper configuration for React extensions.
 */
export type ReactExtensionWrapper = 'none' | 'card' | 'widget' | 'window' | 'panel' | {
    type: 'none' | 'card' | 'widget' | 'window' | 'panel' | 'custom';
    title?: string;
    cssClass?: string;
    showHeader?: boolean;
};
/**
 * Configuration for defining a React extension.
 */
export interface ReactExtensionConfig<TProps = Record<string, unknown>> {
    /** Unique id for this extension */
    id: string;
    /** Slot this extension contributes to */
    slotId: string;
    /** The React component to render */
    component: React.ComponentType<TProps>;
    /** Props to pass to the React component */
    props?: TProps | (() => TProps);
    /** Additional context for the component */
    context?: Record<string, unknown>;
    /** Optional order hint (lower = earlier) */
    order?: number;
    /** Required permissions (all must match) */
    permissions?: string[];
    /** Required permissions (any must match) */
    permissionsAny?: string[];
    /** Feature flag key */
    featureKey?: string;
    /** Custom visibility function */
    visible?: (context: ReactExtensionVisibilityContext) => boolean | Promise<boolean>;
    /** Hide the extension */
    hidden?: boolean;
    /** Wrapper for consistent styling */
    wrapper?: ReactExtensionWrapper;
    /** Called when the extension is mounted */
    onMount?: (context: ReactExtensionLifecycleContext) => void | Promise<void>;
    /** Called when the extension is unmounted */
    onUnmount?: (context: ReactExtensionLifecycleContext) => void | Promise<void>;
    /** Called when the extension becomes active */
    onActivate?: (context: ReactExtensionLifecycleContext) => void | Promise<void>;
    /** Called when the extension becomes inactive */
    onDeactivate?: (context: ReactExtensionLifecycleContext) => void | Promise<void>;
    /** Extension metadata */
    metadata?: {
        title?: string;
        description?: string;
        icon?: string;
        category?: string;
        tags?: string[];
    };
}
/**
 * React extension definition that can be used in plugin definitions.
 */
export interface ReactExtensionDefinition<TProps = Record<string, unknown>> {
    id: string;
    slotId: string;
    component: Type<unknown>;
    config?: {
        props?: TProps;
        context?: Record<string, unknown>;
    };
    order?: number;
    frameworkId: 'react';
    permissions?: string[];
    permissionsAny?: string[];
    featureKey?: string;
    visible?: (context: ReactExtensionVisibilityContext) => boolean | Promise<boolean>;
    hidden?: boolean;
    wrapper?: ReactExtensionWrapper;
    onMount?: (context: ReactExtensionLifecycleContext) => void | Promise<void>;
    onUnmount?: (context: ReactExtensionLifecycleContext) => void | Promise<void>;
    onActivate?: (context: ReactExtensionLifecycleContext) => void | Promise<void>;
    onDeactivate?: (context: ReactExtensionLifecycleContext) => void | Promise<void>;
    metadata?: {
        title?: string;
        description?: string;
        icon?: string;
        category?: string;
        tags?: string[];
    };
    /** Original React component (for reference) */
    reactComponent: React.ComponentType<TProps>;
    /** Props for the React component */
    reactProps?: TProps | (() => TProps);
    /** Context for the React component */
    reactContext?: Record<string, unknown>;
}
/**
 * Define an extension that renders a React component.
 *
 * This helper creates an Angular wrapper component that hosts the React component,
 * allowing you to use React components as plugin extensions.
 *
 * @example
 * ```typescript
 * // Basic usage
 * defineReactExtension({
 *   id: 'my-react-widget',
 *   slotId: PAGE_EXTENSION_SLOTS.DASHBOARD_WIDGETS,
 *   component: MyReactWidget,
 *   props: { title: 'Hello from React!' },
 *   order: 10
 * })
 * ```
 *
 * @param config Configuration for the React extension
 * @returns A ReactExtensionDefinition that can be used in plugin definitions
 */
export declare function defineReactExtension<TProps = Record<string, unknown>>(config: ReactExtensionConfig<TProps>): ReactExtensionDefinition<TProps>;
/**
 * Type guard to check if an extension is a React extension.
 */
export declare function isReactExtension(ext: unknown): ext is ReactExtensionDefinition;
/**
 * Configuration for defining a lazy-loaded React extension.
 * The React component is loaded via dynamic import for code-splitting.
 */
export interface LazyReactExtensionConfig<TProps = Record<string, unknown>> extends Omit<ReactExtensionConfig<TProps>, 'component'> {
    /**
     * Dynamic import function that returns the React component.
     *
     * @example
     * ```ts
     * loadComponent: () => import('./HeavyDashboard').then(m => m.default)
     * // or with named export:
     * loadComponent: () => import('./HeavyDashboard').then(m => m.HeavyDashboard)
     * ```
     */
    loadComponent: () => Promise<React.ComponentType<TProps>>;
}
/**
 * Define a lazy-loaded React extension for code-splitting.
 *
 * The React component is loaded via dynamic import only when the extension
 * is rendered, keeping the initial bundle small.
 *
 * @example
 * ```typescript
 * defineLazyReactExtension({
 *   id: 'heavy-dashboard-widget',
 *   slotId: PAGE_EXTENSION_SLOTS.DASHBOARD_WIDGETS,
 *   loadComponent: () => import('./HeavyDashboard').then(m => m.default),
 *   props: { columns: 3 },
 *   order: 20
 * })
 * ```
 *
 * @param config Configuration with `loadComponent` instead of `component`
 * @returns A ReactExtensionDefinition that can be used in plugin definitions
 */
export declare function defineLazyReactExtension<TProps = Record<string, unknown>>(config: LazyReactExtensionConfig<TProps>): ReactExtensionDefinition<TProps>;
