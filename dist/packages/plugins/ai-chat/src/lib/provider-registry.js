"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderRegistry = void 0;
const common_1 = require("@nestjs/common");
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
class AiProviderRegistry {
    /** Register (or replace) a provider definition. */
    static register(definition) {
        if (this.providers.has(definition.id)) {
            this.logger.warn(`AI provider '${definition.id}' was already registered — replacing.`);
        }
        this.providers.set(definition.id, definition);
        this.logger.log(`AI provider registered: ${definition.id} (${definition.label})`);
    }
    /** Remove a provider (plugin teardown). */
    static unregister(id) {
        this.providers.delete(id);
    }
    static get(id) {
        return this.providers.get(id);
    }
    /** All registered providers, sorted by their `order` (unset sorts last). */
    static list() {
        return [...this.providers.values()].sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
    }
    static clear() {
        this.providers.clear();
    }
}
exports.AiProviderRegistry = AiProviderRegistry;
AiProviderRegistry.logger = new common_1.Logger('AiProviderRegistry');
AiProviderRegistry.providers = new Map();
//# sourceMappingURL=provider-registry.js.map