import { ChangeDetectorRef, Component, Input, inject, Injector, ElementRef, ViewChild } from '@angular/core';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { NgContextProvider } from './ng-react-context';
import * as i0 from "@angular/core";
/**
 * Creates a dynamic Angular component class that wraps a React component.
 * This is used internally by defineReactExtension.
 */
function createReactWrapperComponent(reactComponent, defaultProps, defaultContext) {
    class ReactExtensionWrapperComponent {
        constructor() {
            this._injector = inject(Injector);
            this._root = null;
        }
        ngOnInit() {
            this._root = createRoot(this.hostRef.nativeElement);
            this._render();
        }
        ngOnChanges(changes) {
            if (this._root && (changes['props'] || changes['context'])) {
                this._render();
            }
        }
        ngOnDestroy() {
            this._root?.unmount();
            this._root = null;
        }
        _render() {
            if (!this._root)
                return;
            // Resolve props
            const resolvedDefaultProps = typeof defaultProps === 'function' ? defaultProps() : defaultProps;
            const finalProps = { ...resolvedDefaultProps, ...this.props };
            // Resolve context
            const finalContext = { ...defaultContext, ...this.context };
            this._root.render(React.createElement(NgContextProvider, { injector: this._injector, context: finalContext }, 
            // Wrap in Suspense to support React.lazy() components
            React.createElement(React.Suspense, {
                fallback: React.createElement('div', {
                    style: {
                        padding: '1rem',
                        textAlign: 'center',
                        color: '#8f9bb3',
                        fontSize: '0.875rem'
                    }
                }, 'Loading…')
            }, React.createElement(reactComponent, finalProps))));
        }
        static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ReactExtensionWrapperComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
        static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ReactExtensionWrapperComponent, isStandalone: true, selector: "gz-react-extension-wrapper", inputs: { props: "props", context: "context" }, viewQueries: [{ propertyName: "hostRef", first: true, predicate: ["host"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: '<div #host></div>', isInline: true, styles: [":host{display:contents}\n"] }); }
    }
    i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ReactExtensionWrapperComponent, decorators: [{
                type: Component,
                args: [{ selector: 'gz-react-extension-wrapper', standalone: true, template: '<div #host></div>', styles: [":host{display:contents}\n"] }]
            }], propDecorators: { props: [{
                    type: Input
                }], context: [{
                    type: Input
                }], hostRef: [{
                    type: ViewChild,
                    args: ['host', { static: true }]
                }] } });
    return ReactExtensionWrapperComponent;
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
export function defineReactExtension(config) {
    const wrapperComponent = createReactWrapperComponent(config.component, config.props, config.context);
    return {
        id: config.id,
        slotId: config.slotId,
        component: wrapperComponent,
        config: {
            props: typeof config.props === 'function' ? undefined : config.props,
            context: config.context
        },
        order: config.order,
        frameworkId: 'react',
        // Visibility
        permissions: config.permissions,
        permissionsAny: config.permissionsAny,
        featureKey: config.featureKey,
        visible: config.visible,
        hidden: config.hidden,
        // Wrapper
        wrapper: config.wrapper,
        // Lifecycle
        onMount: config.onMount,
        onUnmount: config.onUnmount,
        onActivate: config.onActivate,
        onDeactivate: config.onDeactivate,
        // Metadata
        metadata: config.metadata,
        // React-specific
        reactComponent: config.component,
        reactProps: config.props,
        reactContext: config.context
    };
}
/**
 * Type guard to check if an extension is a React extension.
 */
export function isReactExtension(ext) {
    return (typeof ext === 'object' &&
        ext !== null &&
        'reactComponent' in ext &&
        typeof ext.reactComponent === 'function');
}
/**
 * Creates a dynamic Angular component that lazy-loads a React component on mount.
 * The React chunk is only downloaded when the extension is rendered.
 */
function createLazyReactWrapperComponent(loadComponent, defaultProps, defaultContext) {
    class LazyReactExtensionWrapperComponent {
        constructor() {
            this._injector = inject(Injector);
            this._cdr = inject(ChangeDetectorRef);
            this._root = null;
            this._resolvedComponent = null;
            this._loading = true;
            this._error = false;
        }
        async ngOnInit() {
            try {
                this._resolvedComponent = await loadComponent();
                this._loading = false;
                this._cdr.detectChanges();
                // After detectChanges, the #host element is now in the DOM
                if (this.hostRef) {
                    this._root = createRoot(this.hostRef.nativeElement);
                    this._render();
                }
            }
            catch (error) {
                console.error('[LazyReactExtension] Failed to load component:', error);
                this._loading = false;
                this._error = true;
                this._cdr.markForCheck();
            }
        }
        ngOnChanges(changes) {
            if (this._root && this._resolvedComponent && (changes['props'] || changes['context'])) {
                this._render();
            }
        }
        ngOnDestroy() {
            this._root?.unmount();
            this._root = null;
            this._resolvedComponent = null;
        }
        _render() {
            if (!this._root || !this._resolvedComponent)
                return;
            const resolvedDefaultProps = typeof defaultProps === 'function' ? defaultProps() : defaultProps;
            const finalProps = { ...resolvedDefaultProps, ...this.props };
            const finalContext = { ...defaultContext, ...this.context };
            this._root.render(React.createElement(NgContextProvider, { injector: this._injector, context: finalContext }, 
            // Wrap in Suspense to support React.lazy() components
            React.createElement(React.Suspense, {
                fallback: React.createElement('div', {
                    style: {
                        padding: '1rem',
                        textAlign: 'center',
                        color: '#8f9bb3',
                        fontSize: '0.875rem'
                    }
                }, 'Loading…')
            }, React.createElement(this._resolvedComponent, finalProps))));
        }
        static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LazyReactExtensionWrapperComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
        static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: LazyReactExtensionWrapperComponent, isStandalone: true, selector: "gz-react-lazy-extension-wrapper", inputs: { props: "props", context: "context" }, viewQueries: [{ propertyName: "hostRef", first: true, predicate: ["host"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
			@if (_loading) {
				<div class="react-lazy-loading">Loading…</div>
			} @else if (_error) {
				<div class="react-lazy-error">Failed to load component</div>
			} @else {
				<div #host></div>
			}
		`, isInline: true, styles: [":host{display:contents}.react-lazy-loading{padding:1rem;text-align:center;color:var(--text-hint-color, #8f9bb3);font-size:.875rem}.react-lazy-error{padding:1rem;text-align:center;color:var(--color-danger-500, #ff3d71);font-size:.875rem}\n"] }); }
    }
    i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LazyReactExtensionWrapperComponent, decorators: [{
                type: Component,
                args: [{ selector: 'gz-react-lazy-extension-wrapper', standalone: true, template: `
			@if (_loading) {
				<div class="react-lazy-loading">Loading…</div>
			} @else if (_error) {
				<div class="react-lazy-error">Failed to load component</div>
			} @else {
				<div #host></div>
			}
		`, styles: [":host{display:contents}.react-lazy-loading{padding:1rem;text-align:center;color:var(--text-hint-color, #8f9bb3);font-size:.875rem}.react-lazy-error{padding:1rem;text-align:center;color:var(--color-danger-500, #ff3d71);font-size:.875rem}\n"] }]
            }], propDecorators: { props: [{
                    type: Input
                }], context: [{
                    type: Input
                }], hostRef: [{
                    type: ViewChild,
                    args: ['host', { static: false }]
                }] } });
    return LazyReactExtensionWrapperComponent;
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
export function defineLazyReactExtension(config) {
    const wrapperComponent = createLazyReactWrapperComponent(config.loadComponent, config.props, config.context);
    // Use a placeholder component type for reactComponent since the real one is lazy
    const placeholderComponent = (() => null);
    return {
        id: config.id,
        slotId: config.slotId,
        component: wrapperComponent,
        config: {
            props: typeof config.props === 'function' ? undefined : config.props,
            context: config.context
        },
        order: config.order,
        frameworkId: 'react',
        // Visibility
        permissions: config.permissions,
        permissionsAny: config.permissionsAny,
        featureKey: config.featureKey,
        visible: config.visible,
        hidden: config.hidden,
        // Wrapper
        wrapper: config.wrapper,
        // Lifecycle
        onMount: config.onMount,
        onUnmount: config.onUnmount,
        onActivate: config.onActivate,
        onDeactivate: config.onDeactivate,
        // Metadata
        metadata: config.metadata,
        // React-specific (placeholder — real component loaded lazily)
        reactComponent: placeholderComponent,
        reactProps: config.props,
        reactContext: config.context
    };
}
//# sourceMappingURL=react-extension.helper.js.map