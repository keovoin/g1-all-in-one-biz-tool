import { ID, IPagination } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../../core/crud';
import { ImportHistory } from './import-history.entity';
import { TypeOrmImportHistoryRepository } from './repository/type-orm-import-history.repository';
import { MikroOrmImportHistoryRepository } from './repository/mikro-orm-import-history.repository';
export declare class ImportHistoryService extends TenantAwareCrudService<ImportHistory> {
    constructor(typeOrmImportHistoryRepository: TypeOrmImportHistoryRepository, mikroOrmImportHistoryRepository: MikroOrmImportHistoryRepository);
    /**
     *
     * @returns
     */
    findAll(): Promise<IPagination<ImportHistory>>;
    /**
     * Reads back the archive one of the current tenant's imports was made from.
     *
     * 🛑 The archive is a full tenant data dump. It used to be offered through `fullUrl`, a public
     * `/public/import/import-<unix-seconds>-<0..999>.zip` URL any unauthenticated caller could guess.
     * It is now reachable only through this method, behind the import-history route's permissions,
     * and only for a row of the caller's OWN tenant.
     *
     * The tenant condition is spelled out here rather than left to `TenantAwareCrudService`, whose
     * `findOneWithTenant()` adds nothing when there is no current user — and a request with no tenant
     * is refused outright instead of being allowed to query with the condition missing.
     *
     * @param id - The import-history row.
     * @returns The original file name and the archive's bytes.
     * @throws ForbiddenException when the request carries no tenant.
     * @throws NotFoundException when the row is not the tenant's, or its archive no longer exists.
     */
    getArchive(id: ID): Promise<{
        file: string;
        content: Buffer;
    }>;
}
