import { BaseAiProviderPlugin } from '@gauzy/plugin-ai-chat';
/**
 * AiProviderGeminiPlugin
 *
 * Contributes the Gemini provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link geminiProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
export declare class AiProviderGeminiPlugin extends BaseAiProviderPlugin {
    protected readonly definition: import("@gauzy/plugin-ai-chat").IAiChatProviderDefinition;
}
