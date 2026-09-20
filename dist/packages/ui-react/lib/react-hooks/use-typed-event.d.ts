import { type PluginEventContract, type PluginEvent, type TypedEventHandle, type SubscribeOptions } from '@gauzy/plugin-ui';
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
export declare function useTypedEvent<T>(contract: PluginEventContract<T>): TypedEventHandle<T>;
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
export declare function useTypedEventListener<T>(contract: PluginEventContract<T>, callback: (event: PluginEvent<T>) => void, options?: SubscribeOptions, deps?: React.DependencyList): void;
