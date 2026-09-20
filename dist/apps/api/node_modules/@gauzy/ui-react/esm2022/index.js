/*
 * Public API Surface of @gauzy/ui-react
 *
 * React-to-Angular bridge: renders React components inside Angular with
 * access to Angular services via the Angular injector.
 */
// Context (for use inside React components)
export { NgContextProvider, NgBridgeContext, useBridgeContext } from './lib/ng-react-context';
// Hooks (for use inside React components)
export { useInjector, useObservable, usePluginState, usePluginSettings, usePluginSetting, useTranslation, usePluginEvents, usePluginEvent, useTypedEvent, useTypedEventListener, useDynamicPlugin } from './lib/react-hooks';
// Error boundary (for isolating React component failures)
export { PluginErrorBoundary } from './lib/plugin-error-boundary';
// Directives (for use in Angular templates)
export { ReactHostDirective, LazyReactHostDirective } from './lib/directives';
// Bridge class and provider
export { ReactBridge } from './lib/react-bridge';
export { REACT_BRIDGE, provideReactBridge, createReactBridge } from './lib/react-bridge.provider';
// React extension helper (for defining React extensions in plugins)
export { defineReactExtension, defineLazyReactExtension, isReactExtension } from './lib/react-extension.helper';
//# sourceMappingURL=index.js.map