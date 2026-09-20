import { IOrganizationPosition, ITag } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class OrganizationPosition extends TenantOrganizationBaseEntity implements IOrganizationPosition {
    name: string;
    tags?: ITag[];
}
