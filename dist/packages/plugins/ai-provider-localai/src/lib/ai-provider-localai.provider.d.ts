import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * LocalAI provider definition — LOCAL chat + speech-to-text.
 *
 * Runs on the tenant's / operator's own infrastructure, needs no API key. Chat goes through the
 * ESM-only `@ai-sdk/openai-compatible` package (LocalAI is OpenAI-shaped), loaded lazily via
 * `importEsm`; speech-to-text goes through the shared helper.
 */
export declare const localAiProviderDefinition: IAiChatProviderDefinition;
