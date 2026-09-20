import { BaseAiProviderPlugin } from '@gauzy/plugin-ai-chat';
/**
 * AiProviderVercelGatewayPlugin
 *
 * Contributes the Vercel AI Gateway provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link vercelGatewayProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
export declare class AiProviderVercelGatewayPlugin extends BaseAiProviderPlugin {
    protected readonly definition: import("@gauzy/plugin-ai-chat").IAiChatProviderDefinition;
}
