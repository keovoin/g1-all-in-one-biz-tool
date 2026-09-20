import { Observable } from 'rxjs';
import { PluginEvent, EmitOptions, SubscribeOptions } from '@gauzy/plugin-ui';
/**
 * Hook return type for usePluginEvents.
 */
export interface UsePluginEventsReturn {
    /**
     * Emit an event to the plugin event bus.
     */
    emit: <T = unknown>(type: string, payload: T, options?: EmitOptions) => void;
    /**
     * Subscribe to events of a specific type.
     * Returns an Observable that can be subscribed to.
     */
    on: <T = unknown>(type: string, options?: SubscribeOptions) => Observable<PluginEvent<T>>;
    /**
     * Subscribe to events matching a pattern (supports wildcards).
     */
    onPattern: <T = unknown>(pattern: string, options?: SubscribeOptions) => Observable<PluginEvent<T>>;
    /**
     * Subscribe once and automatically unsubscribe.
     */
    once: <T = unknown>(type: string, callback: (event: PluginEvent<T>) => void, options?: SubscribeOptions) => void;
}
/**
 * React hook for accessing the Plugin Event Bus.
 *
 * Provides a clean interface for inter-plugin communication from React components.
 * Subscriptions are automatically cleaned up when the component unmounts.
 *
 * @param pluginId Optional plugin ID for scoped event emission
 * @returns Event bus utilities (emit, on, onPattern, once)
 *
 * @example
 * ```tsx
 * function MyReactWidget() {
 *   const events = usePluginEvents('my-plugin');
 *
 *   // Subscribe to events
 *   useEffect(() => {
 *     const sub = events.on('time-tracked').subscribe(event => {
 *       console.log('Time tracked:', event.payload);
 *     });
 *     return () => sub.unsubscribe();
 *   }, [events]);
 *
 *   // Emit an event
 *   const handleClick = () => {
 *     events.emit('widget-clicked', { widgetId: 'my-widget' });
 *   };
 *
 *   return <button onClick={handleClick}>Click me</button>;
 * }
 * ```
 */
export declare function usePluginEvents(pluginId?: string): UsePluginEventsReturn;
/**
 * Hook to subscribe to a specific event type with automatic cleanup.
 *
 * @param type Event type to subscribe to
 * @param callback Callback function
 * @param options Subscribe options
 * @param deps Dependency array for the effect
 *
 * @example
 * ```tsx
 * function MyWidget() {
 *   usePluginEvent('time-tracked', (event) => {
 *     console.log('Time tracked:', event.payload);
 *   });
 *
 *   return <div>Listening for time-tracked events...</div>;
 * }
 * ```
 */
export declare function usePluginEvent<T = unknown>(type: string, callback: (event: PluginEvent<T>) => void, options?: SubscribeOptions, deps?: React.DependencyList): void;
export default usePluginEvents;
