import { IProcessTrackingDataInput, ID } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../core/dto';
/**
 * DTO for processing custom tracking data
 */
export declare class ProcessTrackingDataDTO extends TenantOrganizationBaseDTO implements IProcessTrackingDataInput {
    readonly payload: string;
    readonly startTime?: Date;
    readonly employeeId?: ID;
}
