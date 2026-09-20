export { UiBridge, UiBridgeConfig, UiBridgeMountOptions, UiBridgeMountResult, UiBridgeFramework, UI_BRIDGE_FRAMEWORK } from './ui-bridge.interface';
export { UiBridgeRegistryService, type BridgeFactory, type LazyBridgeRegistration, type BridgeRegistrationOptions } from './ui-bridge-registry.service';
export { FrameworkHostComponent } from './framework-host.component';
export { FrameworkExtensionConfig, FrameworkExtensionDefinition, defineFrameworkExtension, isFrameworkExtension, getExtensionFrameworkId } from './framework-extension.helper';
export { UiBridgeLike, adaptBridge, isUiBridgeLike, provideBridge } from './ui-bridge.adapter';
