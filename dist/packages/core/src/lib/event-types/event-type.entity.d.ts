import { ID, IEmployee, IEventType, ITag } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class EventType extends TenantOrganizationBaseEntity implements IEventType {
    duration: number;
    durationUnit: string;
    title: string;
    description?: string;
    /**
     * Employee
     */
    employee?: IEmployee;
    readonly employeeId?: ID;
    /**
     * Tag
     */
    tags?: ITag[];
}
