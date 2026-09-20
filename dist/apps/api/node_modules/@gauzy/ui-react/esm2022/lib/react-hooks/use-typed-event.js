import { useEffect, useMemo } from 'react';
import { PluginEventBusService, bindEventToBus } from '@gauzy/plugin-ui';
import { useInjector } from './use-injector';
/**
 * React hook for type-safe event handling using event contracts.
 *
 * Returns a `TypedEventHandle` bound to the Angular event bus with
 * fully typed emit and subscribe methods.
 *
 * @param contract The event contract created with `definePluginEvent()`.
 * @returns A type-safe event handle.
 *
 * @example
 * ```tsx
 * // Given an event contract:
 * // const TimeTrackedEvent = definePluginEvent<{ duration: number }>('time-tracker', 'time-tracked');
 *
 * function MyWidget() {
 *   const timeTracked = useTypedEvent(TimeTrackedEvent);
 *
 *   // Emit (fully typed payload)
 *   const handleStop = () => {
 *     timeTracked.emit({ duration: 3600 }); // ← TypeScript checks this
 *   };
 *
 *   // Subscribe (fully typed event)
 *   useEffect(() => {
 *     const sub = timeTracked.on().subscribe(event => {
 *       console.log(event.payload.duration); // ← TypeScript knows this is number
 *     });
 *     return () => sub.unsubscribe();
 *   }, [timeTracked]);
 *
 *   return <button onClick={handleStop}>Stop</button>;
 * }
 * ```
 */
export function useTypedEvent(contract) {
    const eventBus = useInjector(PluginEventBusService);
    return useMemo(() => bindEventToBus(contract, eventBus), [contract, eventBus]);
}
/**
 * React hook for subscribing to a typed event with automatic cleanup.
 *
 * @param contract The event contract.
 * @param callback Callback invoked for each event.
 * @param options Optional subscribe options.
 * @param deps Dependency array for the effect.
 *
 * @example
 * ```tsx
 * useTypedEventListener(TimeTrackedEvent, (event) => {
 *   console.log('Duration:', event.payload.duration);
 * });
 * ```
 */
export function useTypedEventListener(contract, callback, options, deps = []) {
    const handle = useTypedEvent(contract);
    useEffect(() => {
        const subscription = handle.on(options).subscribe(callback);
        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handle, ...deps]);
}
//# sourceMappingURL=use-typed-event.js.map