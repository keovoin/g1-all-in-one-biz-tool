import { ID } from '@gauzy/contracts';
import { TenantSettingService } from '@gauzy/core';
import { TypeOrmDocumentRepository } from '../repositories/type-orm-document.repository';
import { IDocumentQuotaState } from './quota.calculator';
/**
 * Per-organization storage quota (`08-permissions-security.md` §5.7).
 *
 * - Effective quota = org setting `docs.<organizationId>.quotaBytes` when present, else the
 *   deployment default `GAUZY_DOCS_ORG_QUOTA_BYTES`. **`0`/unset = unlimited.**
 * - Usage = `SUM(fileSize)` over **all non-purged** documents of the organization —
 *   archived and soft-deleted (trashed) rows included, because their bytes still exist in
 *   the storage provider.
 * - Uploads reject over quota (`DOCS_QUOTA_EXCEEDED`); system-originated captures
 *   (CHAT/EMAIL) warn and proceed so automated intake never silently drops business records.
 *
 * The arithmetic itself lives in `quota.calculator.ts` (pure, unit-tested); this service is
 * only the I/O around it.
 */
export declare class DocumentQuotaService {
    private readonly typeOrmDocumentRepository;
    private readonly tenantSettingService;
    private readonly logger;
    constructor(typeOrmDocumentRepository: TypeOrmDocumentRepository, tenantSettingService: TenantSettingService);
    /**
     * Resolves the effective quota for one organization.
     *
     * @param organizationId The organization scope.
     * @returns The quota in bytes; `0` = unlimited.
     */
    getQuotaBytes(organizationId: ID): Promise<number>;
    /**
     * Current storage usage of one organization: `SUM(fileSize)` over every non-purged
     * document row (archived + soft-deleted included).
     *
     * @param organizationId The organization scope.
     * @returns The used bytes (0 when nothing is stored or the query fails).
     */
    getUsedBytes(organizationId: ID): Promise<number>;
    /**
     * The quota block reported by `GET /plugins/docs/settings`.
     *
     * @param organizationId The organization scope.
     * @returns Quota, usage, remaining bytes, and the unlimited flag.
     */
    getQuotaState(organizationId: ID): Promise<IDocumentQuotaState>;
    /**
     * Whether accepting `incomingBytes` more would exceed the organization quota.
     *
     * @param incomingBytes The bytes about to be stored.
     * @param state The already-resolved quota state (avoids re-querying per file in a batch).
     * @returns True when the write must be rejected.
     */
    exceeds(incomingBytes: number, state: IDocumentQuotaState): boolean;
}
