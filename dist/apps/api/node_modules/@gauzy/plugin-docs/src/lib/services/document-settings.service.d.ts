import { ID } from '@gauzy/contracts';
import { TenantSettingService } from '@gauzy/core';
import { DocumentSettingsDTO, IDocumentSettings, IDocumentSettingsDefaults } from '../dto/document-settings.dto';
import { DocumentQuotaService } from './document-quota.service';
/**
 * Org-default settings persisted as namespaced rows in the core `tenant_setting` table
 * (`name: 'docs.<organizationId>.<key>'`), plus the read-only deployment capabilities block.
 */
export declare class DocumentSettingsService {
    private readonly tenantSettingService;
    private readonly documentQuotaService;
    private readonly logger;
    constructor(tenantSettingService: TenantSettingService, documentQuotaService: DocumentQuotaService);
    /**
     * Reads the org defaults + deployment capabilities + the live storage-quota state.
     *
     * @param organizationId The organization scope.
     * @returns The settings envelope.
     */
    getSettings(organizationId: ID): Promise<IDocumentSettings>;
    /**
     * Partial update of the org-defaults block only (`capabilities` is never writable).
     *
     * @param organizationId The organization scope.
     * @param input The defaults to update.
     * @returns The updated settings envelope.
     */
    updateSettings(organizationId: ID, input: DocumentSettingsDTO): Promise<IDocumentSettings>;
    /**
     * Whether this deployment can actually answer a *vector* similarity query — i.e. the store
     * the registry would resolve right now is a vector store, not the lexical floor.
     *
     * Deliberately resolved rather than probed provider-by-provider: `GAUZY_DOCS_VECTOR_STORE`
     * can pin a third-party store, and an unavailable pgvector falls through to `lexical`. The
     * capability block has to report what retrieval will really do, so it asks the same
     * `resolve()` the retrieval path asks (`false` ⇒ lexical-only degradation, per the spec's
     * "pgvector available" line).
     *
     * @returns True when the resolved store is vector-capable.
     */
    private isVectorSearchAvailable;
    /**
     * Reads the org-defaults block with documented fallbacks.
     *
     * @param organizationId The organization scope.
     * @returns The defaults block.
     */
    getDefaults(organizationId: ID): Promise<IDocumentSettingsDefaults>;
    /**
     * Builds the namespaced `tenant_setting` row name for one org default.
     */
    private key;
}
