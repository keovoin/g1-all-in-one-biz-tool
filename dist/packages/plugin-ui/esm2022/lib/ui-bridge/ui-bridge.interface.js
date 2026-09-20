/**
 * Well-known UI framework identifiers.
 * Use these constants for consistency, or define custom framework IDs as strings.
 */
export const UI_BRIDGE_FRAMEWORK = {
    /** React framework (react, react-dom) */
    REACT: 'react'
};
/**
 * Abstract base class for UI framework bridges.
 *
 * Implement this class to create a bridge for any UI framework
 * (React, Vue, Svelte, etc.) that can render components inside Angular.
 *
 * @example
 * ```typescript
 * export class ReactBridge extends UiBridge {
 *   readonly config: UiBridgeConfig = {
 *     frameworkId: UI_BRIDGE_FRAMEWORK.REACT,
 *     name: 'React Bridge',
 *     version: '0.1.0'
 *   };
 *
 *   mount(options: UiBridgeMountOptions): UiBridgeMountResult {
 *     // Mount React component using createRoot
 *     const root = createRoot(options.hostElement);
 *     root.render(createElement(options.component, options.props));
 *     return { unmount: () => root.unmount() };
 *   }
 *
 *   isCompatible(component: unknown): boolean {
 *     // Check if component is a React component
 *     return typeof component === 'function';
 *   }
 * }
 * ```
 */
export class UiBridge {
}
//# sourceMappingURL=ui-bridge.interface.js.map