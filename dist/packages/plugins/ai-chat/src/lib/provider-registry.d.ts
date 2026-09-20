import { IAiChatProviderDefinition } from './provider.types';
/**
 * AiProviderRegistry
 *
 * Process-wide registry of AI providers. Provider plugins
 * (`@gauzy/plugin-ai-provider-*`) call {@link AiProviderRegistry.register}
 * from their `onPluginBootstrap`; the chat engine reads the registry at
 * request time.
 *
 * Implemented as a static registry (not Nest DI) so provider plugins do not
 * need to import the chat module's Nest graph — mirroring how backend
 * plugins are composed via the flat `plugins.ts` list.
 */
export declare class AiProviderRegistry {
    private static readonly logger;
    private static readonly providers;
    /** Register (or replace) a provider definition. */
    static register(definition: IAiChatProviderDefinition): void;
    /** Remove a provider (plugin teardown). */
    static unregister(id: string): void;
    static get(id: string): IAiChatProviderDefinition | undefined;
    /** All registered providers, sorted by their `order` (unset sorts last). */
    static list(): IAiChatProviderDefinition[];
    static clear(): void;
}
