"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAiProviderPlugin = void 0;
const chalk = require("chalk");
const provider_registry_1 = require("./provider-registry");
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
class BaseAiProviderPlugin {
    constructor() {
        // Lifecycle logging is enabled by default; subclasses may set `logEnabled = false`.
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     * Registers the provider definition with the AI provider registry.
     */
    onPluginBootstrap() {
        provider_registry_1.AiProviderRegistry.register(this.definition);
        if (this.logEnabled) {
            console.log(chalk.green(`${this.constructor.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     * Removes the provider definition from the AI provider registry.
     */
    onPluginDestroy() {
        provider_registry_1.AiProviderRegistry.unregister(this.definition.id);
        if (this.logEnabled) {
            console.log(chalk.red(`${this.constructor.name} is being destroyed...`));
        }
    }
}
exports.BaseAiProviderPlugin = BaseAiProviderPlugin;
//# sourceMappingURL=base-ai-provider.plugin.js.map