import type { Observable } from 'rxjs';
/**
 * React hook that subscribes to an RxJS Observable and returns its latest value.
 *
 * - Subscribes on mount (or when `observable$` changes), unsubscribes on unmount.
 * - If the Observable is a `BehaviorSubject`, the current value is used as the
 *   initial state (no flash of `initialValue`).
 * - Handles observable reference changes gracefully (resubscribes automatically).
 *
 * @param observable$ The RxJS Observable to subscribe to.
 * @param initialValue Fallback value used before the first emission.
 * @returns The latest emitted value, or `initialValue` if nothing has emitted yet.
 *
 * @example
 * ```tsx
 * const users$ = useMemo(() => userService.getUsers(), [userService]);
 * const users = useObservable(users$, []);
 *
 * return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
 * ```
 *
 * @example BehaviorSubject (synchronous initial value)
 * ```tsx
 * const count$ = useMemo(() => stateService.select<number>('counter'), []);
 * const count = useObservable(count$, 0);
 * ```
 */
export declare function useObservable<T>(observable$: Observable<T>, initialValue: T): T;
export declare function useObservable<T>(observable$: Observable<T>): T | undefined;
