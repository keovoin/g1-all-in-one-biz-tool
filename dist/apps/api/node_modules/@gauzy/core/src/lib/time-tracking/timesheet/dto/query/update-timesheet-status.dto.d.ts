import { ID, IUpdateTimesheetStatusInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../../../core/dto';
import { Timesheet } from '../../timesheet.entity';
declare const UpdateTimesheetStatusDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<Timesheet, "status">>;
/**
 * Update timesheets status request DTO validation
 */
export declare class UpdateTimesheetStatusDTO extends UpdateTimesheetStatusDTO_base implements IUpdateTimesheetStatusInput {
    ids: ID[];
}
export {};
