import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * Gemini provider definition for the AI chat engine.
 *
 * Registered with the AiProviderRegistry by the plugin class. The ESM-only
 * `@ai-sdk/google` package is loaded lazily via `importEsm` so this
 * CommonJS-compiled plugin never `require()`s it at module load time.
 */
export declare const geminiProviderDefinition: IAiChatProviderDefinition;
