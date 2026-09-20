import { BaseAiProviderPlugin } from '@gauzy/plugin-ai-chat';
/**
 * AiProviderMistralPlugin
 *
 * Contributes the Mistral provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link mistralProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
export declare class AiProviderMistralPlugin extends BaseAiProviderPlugin {
    protected readonly definition: import("@gauzy/plugin-ai-chat").IAiChatProviderDefinition;
}
