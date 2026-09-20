import { InjectionToken, type EnvironmentProviders } from '@angular/core';
import { ReactBridge } from './react-bridge';
/**
 * Injection token for the React bridge instance.
 */
export declare const REACT_BRIDGE: InjectionToken<ReactBridge>;
/**
 * Provide the React bridge for dependency injection.
 *
 * @example
 * ```typescript
 * // In your app.config.ts
 * import { provideReactBridge } from '@gauzy/ui-react';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideReactBridge(),
 *     // ... other providers
 *   ]
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Using the bridge in a component
 * import { REACT_BRIDGE } from '@gauzy/ui-react';
 *
 * const bridge = inject(REACT_BRIDGE);
 * bridge.mount({ component: MyReactComponent, hostElement, injector });
 * ```
 *
 * @returns Environment providers for React bridge
 */
export declare function provideReactBridge(): EnvironmentProviders;
/**
 * Create a ReactBridge instance.
 *
 * @returns A new ReactBridge instance
 */
export declare function createReactBridge(): ReactBridge;
