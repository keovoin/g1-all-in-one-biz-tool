import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * Gauzy AI provider definition for the AI chat engine (placeholder).
 *
 * Registered with the {@link AiProviderRegistry} by {@link AiProviderGauzyAiPlugin}
 * so the provider is visible in the registry and the UI, but chat is NOT yet
 * routed through Gauzy AI — {@link IAiChatProviderDefinition.createModel}
 * intentionally throws until the Gauzy AI chat proxy is implemented
 * (see this plugin's README for the planned design).
 */
export declare const gauzyAiProviderDefinition: IAiChatProviderDefinition;
