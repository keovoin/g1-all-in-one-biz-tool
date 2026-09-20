import { BaseAiProviderPlugin } from '@gauzy/plugin-ai-chat';
/**
 * AiProviderOpenRouterPlugin
 *
 * Contributes the OpenRouter provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link openRouterProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
export declare class AiProviderOpenRouterPlugin extends BaseAiProviderPlugin {
    protected readonly definition: import("@gauzy/plugin-ai-chat").IAiChatProviderDefinition;
}
