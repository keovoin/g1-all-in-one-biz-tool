import { createRoot } from 'react-dom/client';
import React from 'react';
import { NgContextProvider } from './ng-react-context';
import { UiBridge, UI_BRIDGE_FRAMEWORK } from '@gauzy/plugin-ui';
/**
 * React bridge for rendering React components inside Angular.
 *
 * Implements UiBridge using the React 18+ createRoot API to mount React
 * components and provides access to Angular services via NgContextProvider.
 *
 * @example
 * ```typescript
 * const bridge = new ReactBridge();
 * const result = bridge.mount({
 *   component: MyReactComponent,
 *   props: { title: 'Hello!' },
 *   hostElement: element,
 *   injector: angularInjector
 * });
 *
 * // Later, to unmount:
 * result.unmount();
 * ```
 */
export class ReactBridge extends UiBridge {
    constructor() {
        super(...arguments);
        this.config = {
            frameworkId: UI_BRIDGE_FRAMEWORK.REACT,
            name: 'React Bridge',
            version: '0.1.0'
        };
    }
    /**
     * Mount a React component into an Angular host element.
     */
    mount(options) {
        const { component, props, context, hostElement, injector } = options;
        const root = createRoot(hostElement);
        const renderElement = (currentProps) => {
            const element = React.createElement(NgContextProvider, {
                injector,
                context: context ?? {}
            }, 
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
            }, React.createElement(component, currentProps)));
            root.render(element);
        };
        renderElement(props);
        return {
            unmount: () => {
                root.unmount();
            },
            updateProps: (newProps) => {
                renderElement(newProps);
            }
        };
    }
    /**
     * Check if a component is compatible with React.
     */
    isCompatible(component) {
        if (!component) {
            return false;
        }
        if (typeof component === 'function') {
            const proto = component.prototype;
            if (proto?.isReactComponent) {
                return true;
            }
            if (component.length <= 2) {
                return true;
            }
        }
        if (typeof component === 'object') {
            if ('$$typeof' in component) {
                return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=react-bridge.js.map