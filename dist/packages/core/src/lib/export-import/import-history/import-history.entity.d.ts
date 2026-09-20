import { IImportHistory, ImportStatusEnum } from '@gauzy/contracts';
import { TenantBaseEntity } from '../../core/entities/internal';
export declare class ImportHistory extends TenantBaseEntity implements IImportHistory {
    file: string;
    path: string;
    size: number;
    status: ImportStatusEnum;
    importDate?: Date;
    /**
     * No longer populated. It used to carry the storage URL of the uploaded archive — a full tenant
     * data dump — which for the local provider was a guessable, unauthenticated `/public/` link. The
     * archive is downloaded through `GET /import/history/:id/download` instead. Kept on the entity so
     * the response shape does not change for existing clients.
     */
    fullUrl?: string;
}
