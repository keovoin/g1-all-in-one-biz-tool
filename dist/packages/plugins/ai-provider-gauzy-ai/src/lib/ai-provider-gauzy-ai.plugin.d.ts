import { BaseAiProviderPlugin } from '@gauzy/plugin-ai-chat';
/**
 * AiProviderGauzyAiPlugin
 *
 * Contributes the Gauzy AI (placeholder — chat not routed yet) provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link gauzyAiProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
export declare class AiProviderGauzyAiPlugin extends BaseAiProviderPlugin {
    protected readonly definition: import("@gauzy/plugin-ai-chat").IAiChatProviderDefinition;
}
