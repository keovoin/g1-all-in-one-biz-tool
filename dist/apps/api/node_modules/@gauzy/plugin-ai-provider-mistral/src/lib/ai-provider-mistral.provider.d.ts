import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * Mistral AI provider definition for the AI chat engine.
 *
 * Chat goes through the ESM-only `@ai-sdk/openai-compatible` package (Mistral's chat API is
 * OpenAI-shaped), loaded lazily via `importEsm`. Speech-to-text goes through the shared helper.
 */
export declare const mistralProviderDefinition: IAiChatProviderDefinition;
