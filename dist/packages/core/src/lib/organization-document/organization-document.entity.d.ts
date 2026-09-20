import { IImageAsset as IDocumentAsset, IOrganizationDocument } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationDocument extends TenantOrganizationBaseEntity implements IOrganizationDocument {
    name: string;
    documentUrl: string;
    /**
     * Document Asset
     */
    document?: IDocumentAsset;
    documentId?: IDocumentAsset['id'];
}
