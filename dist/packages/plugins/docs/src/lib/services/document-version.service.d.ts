import { ID, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from '@gauzy/core';
import { Document } from '../entities/document.entity';
import { DocumentVersion } from '../entities/document-version.entity';
import { MikroOrmDocumentVersionRepository } from '../repositories/mikro-orm-document-version.repository';
import { TypeOrmDocumentRepository } from '../repositories/type-orm-document.repository';
import { TypeOrmDocumentVersionRepository } from '../repositories/type-orm-document-version.repository';
export declare class DocumentVersionService extends TenantAwareCrudService<DocumentVersion> {
    readonly typeOrmDocumentVersionRepository: TypeOrmDocumentVersionRepository;
    readonly mikroOrmDocumentVersionRepository: MikroOrmDocumentVersionRepository;
    private readonly typeOrmDocumentRepository;
    private readonly logger;
    constructor(typeOrmDocumentVersionRepository: TypeOrmDocumentVersionRepository, mikroOrmDocumentVersionRepository: MikroOrmDocumentVersionRepository, typeOrmDocumentRepository: TypeOrmDocumentRepository);
    /**
     * Captures a debounced PAGE version snapshot of the **pre-update** content.
     *
     * Debounce: if the newest snapshot for (`documentId`, current employee) is younger than the
     * window — default 10 minutes, env `GAUZY_DOCS_VERSION_DEBOUNCE_MINUTES` — the capture is
     * skipped (the autosave stream rolls up into the previous snapshot). A *different* editor
     * always captures immediately, so no author's work is silently absorbed into someone else's
     * snapshot. `document.version` increments exactly with capture count.
     *
     * @param document The loaded document (pre-update state).
     * @param options `force: true` bypasses the debounce (explicit snapshot / restore path).
     * @returns The captured version, or null when the debounce absorbed the save.
     */
    captureSnapshotIfNeeded(document: Document, options?: {
        force?: boolean;
    }): Promise<DocumentVersion | null>;
    /**
     * Paginated version history for a document, newest first. The list projection returns
     * `id, name, lastSavedAt, createdById` — never content columns.
     *
     * @param document The scoped parent document.
     * @param params Pagination params.
     * @returns Paginated version list projections.
     */
    getVersions(document: Document, params: Pick<BaseQueryDTO<DocumentVersion>, 'take' | 'skip'>): Promise<IPagination<DocumentVersion>>;
    /**
     * Loads one full snapshot (incl. content columns) of a document.
     *
     * @param document The scoped parent document.
     * @param versionId The version id.
     * @returns The full snapshot.
     */
    getVersion(document: Document, versionId: ID): Promise<DocumentVersion>;
    /**
     * **Non-destructive** restore: first snapshots the current content as a new version (debounce
     * bypassed), then copies the target snapshot's content onto the document.
     *
     * @param document The scoped parent document (must be an unlocked PAGE).
     * @param versionId The version to restore.
     * @returns The updated document.
     */
    restoreVersion(document: Document, versionId: ID): Promise<Document>;
}
