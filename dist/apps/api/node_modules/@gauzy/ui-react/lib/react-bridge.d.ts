import { UiBridge, UiBridgeConfig, UiBridgeMountOptions, UiBridgeMountResult } from '@gauzy/plugin-ui';
export type ReactBridgeConfig = UiBridgeConfig;
export type ReactBridgeMountOptions<TProps = unknown, TContext = unknown> = UiBridgeMountOptions<TProps, TContext>;
export type ReactBridgeMountResult = UiBridgeMountResult;
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
export declare class ReactBridge extends UiBridge {
    readonly config: UiBridgeConfig;
    /**
     * Mount a React component into an Angular host element.
     */
    mount(options: UiBridgeMountOptions): UiBridgeMountResult;
    /**
     * Check if a component is compatible with React.
     */
    isCompatible(component: unknown): boolean;
}
