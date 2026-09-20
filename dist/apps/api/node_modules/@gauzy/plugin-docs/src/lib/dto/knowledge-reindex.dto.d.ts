/**
 * Body of `POST /api/plugins/docs/documents/:id/knowledge/reindex`.
 */
export declare class ReindexDocumentKnowledgeDTO {
    /** True bypasses the `contentHash` skip-if-unchanged short-circuit. */
    readonly force?: boolean;
}
/**
 * Body of the bulk `POST /api/plugins/docs/knowledge/reindex` sweep (§8.4).
 */
export declare class BulkKnowledgeReindexDTO {
    /** `model-drift` re-indexes only mismatched documents; `all` re-indexes everything INDEXED. */
    readonly scope?: 'model-drift' | 'all';
    /** True returns the affected count without enqueueing. */
    readonly dryRun?: boolean;
}
