import { IEmployeeNotificationSettingCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto/tenant-organization-base.dto';
import { EmployeeNotificationSetting } from '../employee-notification-setting.entity';
declare const CreateEmployeeNotificationSettingDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Omit<EmployeeNotificationSetting, "employee" | "employeeId">>;
/**
 * Create EmployeeNotificationSetting validation request DTO
 */
export declare class CreateEmployeeNotificationSettingDTO extends CreateEmployeeNotificationSettingDTO_base implements IEmployeeNotificationSettingCreateInput {
}
export {};
