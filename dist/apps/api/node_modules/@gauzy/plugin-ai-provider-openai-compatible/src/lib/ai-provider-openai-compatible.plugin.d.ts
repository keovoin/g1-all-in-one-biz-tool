import { BaseAiProviderPlugin } from '@gauzy/plugin-ai-chat';
/**
 * AiProviderOpenAiCompatiblePlugin
 *
 * Contributes the OpenAI-compatible provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link openAiCompatibleProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
export declare class AiProviderOpenAiCompatiblePlugin extends BaseAiProviderPlugin {
    protected readonly definition: import("@gauzy/plugin-ai-chat").IAiChatProviderDefinition;
}
