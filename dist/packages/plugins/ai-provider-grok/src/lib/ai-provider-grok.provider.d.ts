import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * Grok provider definition for the AI chat engine.
 *
 * Registered with the AiProviderRegistry by the plugin class. The ESM-only
 * `@ai-sdk/xai` package is loaded lazily via `importEsm` so this
 * CommonJS-compiled plugin never `require()`s it at module load time.
 */
export declare const grokProviderDefinition: IAiChatProviderDefinition;
