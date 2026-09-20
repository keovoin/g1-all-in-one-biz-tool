import { IEmployeeLevel, ITag } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class EmployeeLevel extends TenantOrganizationBaseEntity implements IEmployeeLevel {
    level: string;
    /**
     * Tag
     */
    tags?: ITag[];
}
