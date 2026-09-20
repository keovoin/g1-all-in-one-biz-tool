import { Component, type ErrorInfo, type ReactNode } from 'react';
/**
 * Error details captured by the PluginErrorBoundary.
 */
export interface PluginErrorInfo {
    /** The thrown error. */
    error: Error;
    /** React component stack trace. */
    componentStack?: string;
    /** Plugin ID if available from context. */
    pluginId?: string;
}
/**
 * Props for PluginErrorBoundary.
 */
export interface PluginErrorBoundaryProps {
    /** Child components to render. */
    children?: ReactNode;
    /** Plugin identifier (for scoped error reporting). */
    pluginId?: string;
    /** Custom fallback UI. Receives error info and a retry function. */
    fallback?: ReactNode | ((info: PluginErrorInfo, retry: () => void) => ReactNode);
    /** Called when an error is caught. Use for logging/reporting. */
    onError?: (info: PluginErrorInfo) => void;
}
interface State {
    error: Error | null;
    componentStack: string | null;
}
/**
 * React error boundary that isolates plugin component failures.
 *
 * Catches JavaScript errors anywhere in its child component tree,
 * logs them, shows a fallback UI, and provides a retry mechanism.
 * One plugin's crash won't take down the rest of the application.
 *
 * Automatically injected by `NgContextProvider` around all React
 * components rendered inside Angular. Can also be used manually
 * for finer-grained isolation within a plugin.
 *
 * @example Automatic (via NgContextProvider — no action needed)
 * ```tsx
 * // All React components inside Angular already have error boundaries
 * <div [gaReactHost]="MyComponent"></div>
 * ```
 *
 * @example Manual (for isolating parts of a plugin)
 * ```tsx
 * function Dashboard() {
 *   return (
 *     <div>
 *       <PluginErrorBoundary pluginId="charts" fallback={<p>Chart failed</p>}>
 *         <ChartWidget />
 *       </PluginErrorBoundary>
 *       <PluginErrorBoundary pluginId="stats">
 *         <StatsWidget />
 *       </PluginErrorBoundary>
 *     </div>
 *   );
 * }
 * ```
 */
export declare class PluginErrorBoundary extends Component<PluginErrorBoundaryProps, State> {
    state: State;
    static getDerivedStateFromError(error: Error): Partial<State>;
    componentDidCatch(error: Error, info: ErrorInfo): void;
    private _handleRetry;
    render(): ReactNode;
}
export {};
