import type { Injector, ProviderToken } from '@angular/core';
/**
 * React hook to access Angular services from within a React component.
 * Must be used inside a component rendered under NgContextProvider.
 *
 * With token: returns the injected service.
 * Without token: returns the Injector for multiple lookups.
 *
 * @example
 * ```tsx
 * const router = useInjector(Router);
 * router.navigate(['/home']);
 * ```
 *
 * @example
 * ```tsx
 * const injector = useInjector();
 * const http = injector.get(HttpClient);
 * ```
 */
export declare function useInjector(): Injector;
export declare function useInjector<T>(token: ProviderToken<T>): T;
