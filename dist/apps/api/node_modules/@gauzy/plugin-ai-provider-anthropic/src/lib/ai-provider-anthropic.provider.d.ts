import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * Anthropic (Claude) provider definition for the AI chat engine.
 *
 * Registered with the {@link AiProviderRegistry} by {@link AiProviderAnthropicPlugin}.
 * The ESM-only `@ai-sdk/anthropic` package is loaded lazily via `importEsm`
 * so this CommonJS-compiled plugin never `require()`s it at module load time.
 */
export declare const anthropicProviderDefinition: IAiChatProviderDefinition;
