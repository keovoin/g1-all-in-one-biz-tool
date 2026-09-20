import { BaseAiProviderPlugin } from '@gauzy/plugin-ai-chat';
/**
 * AiProviderWhisperCppPlugin
 *
 * Contributes the whisper.cpp provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link whisperCppProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
export declare class AiProviderWhisperCppPlugin extends BaseAiProviderPlugin {
    protected readonly definition: import("@gauzy/plugin-ai-chat").IAiChatProviderDefinition;
}
