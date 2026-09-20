import { IActivity, IBulkActivitiesInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../core/dto';
import { EmployeeFeatureDTO } from '../../../employee/dto';
declare const BulkActivityInputDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & EmployeeFeatureDTO>;
/**
 * Get activities request DTO validation
 */
export declare class BulkActivityInputDTO extends BulkActivityInputDTO_base implements IBulkActivitiesInput {
    readonly activities: IActivity[];
}
export {};
