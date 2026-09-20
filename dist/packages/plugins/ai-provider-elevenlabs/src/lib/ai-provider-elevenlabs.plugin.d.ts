import { BaseAiProviderPlugin } from '@gauzy/plugin-ai-chat';
/**
 * AiProviderElevenLabsPlugin
 *
 * Contributes the ElevenLabs provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link elevenLabsProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
export declare class AiProviderElevenLabsPlugin extends BaseAiProviderPlugin {
    protected readonly definition: import("@gauzy/plugin-ai-chat").IAiChatProviderDefinition;
}
