import { BaseAiProviderPlugin } from '@gauzy/plugin-ai-chat';
/**
 * AiProviderDeepgramPlugin
 *
 * Contributes the Deepgram provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link deepgramProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
export declare class AiProviderDeepgramPlugin extends BaseAiProviderPlugin {
    protected readonly definition: import("@gauzy/plugin-ai-chat").IAiChatProviderDefinition;
}
