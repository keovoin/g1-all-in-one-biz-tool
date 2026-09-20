import { BaseAiProviderPlugin } from '@gauzy/plugin-ai-chat';
/**
 * AiProviderAnthropicPlugin
 *
 * Contributes the Anthropic (Claude) provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link anthropicProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
export declare class AiProviderAnthropicPlugin extends BaseAiProviderPlugin {
    protected readonly definition: import("@gauzy/plugin-ai-chat").IAiChatProviderDefinition;
}
