import { IEmployee, ITimeOff as ITimeOffRequest, ITimeOffPolicy, IImageAsset as IDocumentAsset } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class TimeOffRequest extends TenantOrganizationBaseEntity implements ITimeOffRequest {
    documentUrl?: string;
    description?: string;
    start: Date;
    end: Date;
    requestDate: Date;
    status?: string;
    isHoliday?: boolean;
    policy?: ITimeOffPolicy;
    policyId?: string;
    /**
     * Document Asset
     */
    document?: IDocumentAsset;
    documentId?: IDocumentAsset['id'];
    employees?: IEmployee[];
}
