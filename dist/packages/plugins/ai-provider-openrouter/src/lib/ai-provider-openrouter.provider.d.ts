import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * OpenRouter provider definition for the AI chat engine.
 *
 * Registered with the {@link AiProviderRegistry} by {@link AiProviderOpenRouterPlugin}.
 * The ESM-only `@openrouter/ai-sdk-provider` package is loaded lazily via
 * `importEsm` so this CommonJS-compiled plugin never `require()`s it at
 * module load time.
 */
export declare const openRouterProviderDefinition: IAiChatProviderDefinition;
