import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * Groq provider definition for the AI chat engine.
 *
 * Chat goes through the ESM-only `@ai-sdk/openai-compatible` package (Groq's API is
 * OpenAI-shaped), loaded lazily via `importEsm` so this CommonJS-compiled plugin never
 * `require()`s it at module load time. Speech-to-text goes through the shared helper.
 */
export declare const groqProviderDefinition: IAiChatProviderDefinition;
