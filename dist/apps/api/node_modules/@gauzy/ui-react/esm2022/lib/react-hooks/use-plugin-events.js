import { useEffect, useMemo, useCallback } from 'react';
import { Observable } from 'rxjs';
import { useInjector } from './use-injector';
import { PluginEventBusService } from '@gauzy/plugin-ui';
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
export function usePluginEvents(pluginId) {
    const injector = useInjector();
    // Get the event bus service from Angular DI
    const eventBus = useMemo(() => {
        if (!injector)
            return null;
        try {
            return injector.get(PluginEventBusService, null);
        }
        catch {
            return null;
        }
    }, [injector]);
    // Emit function
    const emit = useCallback((type, payload, options) => {
        if (!eventBus) {
            console.warn('[usePluginEvents] Event bus not available');
            return;
        }
        eventBus.emit(type, payload, {
            ...options,
            source: options?.source ?? pluginId
        });
    }, [eventBus, pluginId]);
    // Subscribe function
    const on = useCallback((type, options) => {
        if (!eventBus) {
            console.warn('[usePluginEvents] Event bus not available');
            // Return empty observable
            return new Observable();
        }
        return eventBus.on(type, options);
    }, [eventBus]);
    // Pattern subscribe function
    const onPattern = useCallback((pattern, options) => {
        if (!eventBus) {
            console.warn('[usePluginEvents] Event bus not available');
            return new Observable();
        }
        return eventBus.onPattern(pattern, options);
    }, [eventBus]);
    // Once function
    const once = useCallback((type, callback, options) => {
        if (!eventBus) {
            console.warn('[usePluginEvents] Event bus not available');
            return;
        }
        eventBus.once(type, callback, options);
    }, [eventBus]);
    return { emit, on, onPattern, once };
}
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
export function usePluginEvent(type, callback, options, deps = []) {
    const events = usePluginEvents();
    useEffect(() => {
        const subscription = events.on(type, options).subscribe(callback);
        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, ...deps]);
}
export default usePluginEvents;
//# sourceMappingURL=use-plugin-events.js.map