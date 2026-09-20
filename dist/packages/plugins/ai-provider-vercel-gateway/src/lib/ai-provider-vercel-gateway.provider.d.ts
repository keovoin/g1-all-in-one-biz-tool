import { IAiChatProviderDefinition } from '@gauzy/plugin-ai-chat';
/**
 * Vercel AI Gateway provider definition for the AI chat engine.
 *
 * Registered with the {@link AiProviderRegistry} by {@link AiProviderVercelGatewayPlugin}.
 * The ESM-only `@ai-sdk/gateway` package is loaded lazily via `importEsm`
 * so this CommonJS-compiled plugin never `require()`s it at module load time.
 */
export declare const vercelGatewayProviderDefinition: IAiChatProviderDefinition;
