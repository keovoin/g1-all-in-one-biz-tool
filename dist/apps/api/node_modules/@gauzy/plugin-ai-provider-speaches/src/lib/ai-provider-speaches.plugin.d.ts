import { BaseAiProviderPlugin } from '@gauzy/plugin-ai-chat';
/**
 * AiProviderSpeachesPlugin
 *
 * Contributes the Speaches provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link speachesProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
export declare class AiProviderSpeachesPlugin extends BaseAiProviderPlugin {
    protected readonly definition: import("@gauzy/plugin-ai-chat").IAiChatProviderDefinition;
}
