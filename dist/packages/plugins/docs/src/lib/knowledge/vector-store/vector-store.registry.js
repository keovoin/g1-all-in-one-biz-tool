"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentVectorStoreRegistry = void 0;
const common_1 = require("@nestjs/common");
const docs_config_1 = require("../../docs.config");
/**
 * DocumentVectorStoreRegistry
 *
 * Process-wide registry of vector-store providers, mirroring the AI-chat plugin's
 * `AiProviderRegistry` composition style: a static registry (not Nest DI) so third-party
 * store plugins register without importing this plugin's Nest graph.
 *
 * Resolution order:
 * 1. `GAUZY_DOCS_VECTOR_STORE` pin — when set, that provider is used if available
 *    (an unavailable pinned provider logs a warning and falls through);
 * 2. registration order, first available provider wins (the plugin registers `pgvector`
 *    before `lexical`, and `lexical` is always available — resolution never fails).
 */
class DocumentVectorStoreRegistry {
    /** Registers (or replaces) a store provider. */
    static register(store) {
        if (this.stores.has(store.id)) {
            this.logger.warn(`Vector store '${store.id}' was already registered — replacing.`);
        }
        this.stores.set(store.id, store);
        this.logger.log(`Vector store registered: ${store.id}`);
    }
    /** Removes a store provider (plugin teardown). */
    static unregister(id) {
        this.stores.delete(id);
    }
    static get(id) {
        return this.stores.get(id);
    }
    /** All registered stores in registration order. */
    static list() {
        return [...this.stores.values()];
    }
    static clear() {
        this.stores.clear();
    }
    /**
     * Resolves the active store: the `GAUZY_DOCS_VECTOR_STORE` pin when set and available,
     * else the first available registered store.
     *
     * @returns The resolved store, or `null` when nothing is registered/available.
     */
    static async resolve() {
        const pinned = (0, docs_config_1.getDocsConfig)().vectorStore;
        if (pinned) {
            const store = this.stores.get(pinned);
            if (store && (await this.safeIsAvailable(store))) {
                return store;
            }
            this.logger.warn(`Pinned vector store '${pinned}' is ${store ? 'not available' : 'not registered'} — falling back.`);
        }
        for (const store of this.stores.values()) {
            if (await this.safeIsAvailable(store)) {
                return store;
            }
        }
        return null;
    }
    /** An availability probe must never throw the resolution over. */
    static async safeIsAvailable(store) {
        try {
            return await store.isAvailable();
        }
        catch (error) {
            this.logger.warn(`Vector store '${store.id}' availability probe failed: ${error.message}`);
            return false;
        }
    }
}
exports.DocumentVectorStoreRegistry = DocumentVectorStoreRegistry;
DocumentVectorStoreRegistry.logger = new common_1.Logger('DocumentVectorStoreRegistry');
DocumentVectorStoreRegistry.stores = new Map();
//# sourceMappingURL=vector-store.registry.js.map