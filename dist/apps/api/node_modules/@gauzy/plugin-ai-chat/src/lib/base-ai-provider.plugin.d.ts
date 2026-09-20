import { IOnPluginBootstrap, IOnPluginDestroy } from '@gauzy/plugin';
import { IAiChatProviderDefinition } from './provider.types';
/**
 * BaseAiProviderPlugin
 *
 * Shared lifecycle for `@gauzy/plugin-ai-provider-*` plugins: registers the
 * plugin's {@link IAiChatProviderDefinition} with the {@link AiProviderRegistry}
 * on bootstrap and removes it on destroy.
 *
 * A provider plugin only needs to supply its definition:
 *
 * ```ts
 * @Plugin({})
 * export class AiProviderAcmePlugin extends BaseAiProviderPlugin {
 * 	protected readonly definition = acmeProviderDefinition;
 * }
 * ```
 */
export declare abstract class BaseAiProviderPlugin implements IOnPluginBootstrap, IOnPluginDestroy {
    /** The provider definition this plugin contributes. */
    protected abstract readonly definition: IAiChatProviderDefinition;
    protected logEnabled: boolean;
    /**
     * Called when the plugin is being initialized.
     * Registers the provider definition with the AI provider registry.
     */
    onPluginBootstrap(): void | Promise<void>;
    /**
     * Called when the plugin is being destroyed.
     * Removes the provider definition from the AI provider registry.
     */
    onPluginDestroy(): void | Promise<void>;
}
