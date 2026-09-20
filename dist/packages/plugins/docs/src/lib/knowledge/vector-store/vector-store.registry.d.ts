import { IDocumentVectorStore } from './vector-store.interface';
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
export declare class DocumentVectorStoreRegistry {
    private static readonly logger;
    private static readonly stores;
    /** Registers (or replaces) a store provider. */
    static register(store: IDocumentVectorStore): void;
    /** Removes a store provider (plugin teardown). */
    static unregister(id: string): void;
    static get(id: string): IDocumentVectorStore | undefined;
    /** All registered stores in registration order. */
    static list(): IDocumentVectorStore[];
    static clear(): void;
    /**
     * Resolves the active store: the `GAUZY_DOCS_VECTOR_STORE` pin when set and available,
     * else the first available registered store.
     *
     * @returns The resolved store, or `null` when nothing is registered/available.
     */
    static resolve(): Promise<IDocumentVectorStore | null>;
    /** An availability probe must never throw the resolution over. */
    private static safeIsAvailable;
}
