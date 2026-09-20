import { IOnPluginBootstrap, IOnPluginDestroy } from '@gauzy/plugin';
/**
 * AiChatPlugin
 *
 * Backend engine for the embedded AI agent chat:
 * - `POST /api/ai-chat` — streaming chat endpoint (Vercel AI SDK UI message stream)
 * - `GET  /api/ai-chat/config` — provider/model configuration for the current tenant
 * - `/api/ai-chat/credentials` — per-tenant BYOK provider credentials (encrypted at rest)
 *
 * AI providers are contributed by separate plugins
 * (`@gauzy/plugin-ai-provider-anthropic`, `-openai`, `-openrouter`,
 * `-vercel-gateway`, `-gauzy-ai`) via the {@link AiProviderRegistry}.
 */
export declare class AiChatPlugin implements IOnPluginBootstrap, IOnPluginDestroy {
    private logEnabled;
    onPluginBootstrap(): void | Promise<void>;
    onPluginDestroy(): void | Promise<void>;
}
