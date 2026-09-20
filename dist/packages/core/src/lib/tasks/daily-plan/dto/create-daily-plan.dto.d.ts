import { DailyPlanStatusEnum, ID, IDailyPlanCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../core/dto';
import { EmployeeFeatureDTO } from '../../../employee/dto';
import { OrganizationTeamFeatureDTO } from '../../../organization-team/dto';
declare const CreateDailyPlanDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & EmployeeFeatureDTO & OrganizationTeamFeatureDTO>;
/**
 * Create Daily Plan DTO validation
 */
export declare class CreateDailyPlanDTO extends CreateDailyPlanDTO_base implements IDailyPlanCreateInput {
    readonly date: Date;
    readonly workTimePlanned: number;
    readonly status: DailyPlanStatusEnum;
    readonly taskId?: ID;
}
export {};
