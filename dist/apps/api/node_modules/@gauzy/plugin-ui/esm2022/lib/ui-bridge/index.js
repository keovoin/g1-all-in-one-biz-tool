/*
 * UI Bridge - Framework-agnostic bridge system for rendering
 * non-Angular components (React, Vue, Svelte, etc.) inside Angular.
 */
// Core interface and types
export { UiBridge, UI_BRIDGE_FRAMEWORK } from './ui-bridge.interface';
// Registry service
export { UiBridgeRegistryService } from './ui-bridge-registry.service';
// Host component
export { FrameworkHostComponent } from './framework-host.component';
// Extension helpers
export { defineFrameworkExtension, isFrameworkExtension, getExtensionFrameworkId } from './framework-extension.helper';
// Bridge adapter (for integrating external bridges)
export { adaptBridge, isUiBridgeLike, provideBridge } from './ui-bridge.adapter';
//# sourceMappingURL=index.js.map