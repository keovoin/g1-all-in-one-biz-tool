import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * Generic OpenAI-compatible endpoint provider definition — self-hosted / gateway chat + STT.
 *
 * The TENANT supplies the base URL (`requiresBaseUrl`); an API key is optional (`requiresApiKey:
 * false`) because most local servers run without one. Chat goes through the ESM-only
 * `@ai-sdk/openai-compatible` package, loaded lazily via `importEsm`.
 */
export declare const openAiCompatibleProviderDefinition: IAiChatProviderDefinition;
