import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { LexicalStoreProvider } from './knowledge/vector-store/providers/lexical.provider';
import { PgVectorStoreProvider } from './knowledge/vector-store/providers/pgvector.provider';
export declare class DocsModule implements OnModuleInit, OnModuleDestroy {
    private readonly pgVectorStoreProvider;
    private readonly lexicalStoreProvider;
    private readonly logger;
    constructor(pgVectorStoreProvider: PgVectorStoreProvider, lexicalStoreProvider: LexicalStoreProvider);
    /**
     * Registers the built-in vector-store providers. Order matters: `pgvector` first (the
     * preferred store when available), `lexical` last (the always-available floor).
     * Third-party stores register additional providers via the exported
     * `DocumentVectorStoreRegistry`.
     */
    onModuleInit(): void;
    onModuleDestroy(): void;
}
