/**
 * Define an extension that renders a non-Angular framework component.
 *
 * Supports both eager and lazy framework components for code-splitting.
 *
 * @example
 * ```typescript
 * // Eager (imported at definition time)
 * defineFrameworkExtension({
 *   id: 'my-react-widget',
 *   slotId: PAGE_EXTENSION_SLOTS.DASHBOARD_WIDGETS,
 *   frameworkId: UI_BRIDGE_FRAMEWORK.REACT,
 *   frameworkComponent: MyReactWidget,
 *   frameworkProps: { title: 'Hello from React!' },
 *   order: 10
 * })
 *
 * // Lazy (loaded on first render)
 * defineFrameworkExtension({
 *   id: 'heavy-chart',
 *   slotId: PAGE_EXTENSION_SLOTS.DASHBOARD_WINDOWS,
 *   frameworkId: UI_BRIDGE_FRAMEWORK.REACT,
 *   loadFrameworkComponent: () => import('./HeavyChart').then(m => m.HeavyChart),
 *   order: 20
 * })
 * ```
 */
export function defineFrameworkExtension(config) {
    const resolvedProps = typeof config.frameworkProps === 'function' ? config.frameworkProps() : config.frameworkProps;
    return {
        id: config.id,
        slotId: config.slotId,
        order: config.order,
        frameworkId: config.frameworkId,
        frameworkComponent: config.frameworkComponent,
        loadFrameworkComponent: config.loadFrameworkComponent,
        frameworkProps: config.frameworkProps,
        frameworkContext: config.frameworkContext,
        config: {
            frameworkId: config.frameworkId,
            component: config.frameworkComponent,
            props: resolvedProps,
            context: config.frameworkContext
        }
    };
}
/**
 * Type guard to check if an extension is a framework extension.
 * Recognizes both eager (`frameworkComponent`) and lazy (`loadFrameworkComponent`) extensions.
 */
export function isFrameworkExtension(ext) {
    return 'frameworkId' in ext && ('frameworkComponent' in ext || 'loadFrameworkComponent' in ext);
}
/**
 * Get the framework ID from an extension if it's a framework extension.
 */
export function getExtensionFrameworkId(ext) {
    return isFrameworkExtension(ext) ? ext.frameworkId : undefined;
}
//# sourceMappingURL=framework-extension.helper.js.map