import { IEmployeeNotificationSettingUpdateInput } from '@gauzy/contracts';
import { CreateEmployeeNotificationSettingDTO } from './create-employee-notification-setting.dto';
declare const UpdateEmployeeNotificationSettingDTO_base: import("@nestjs/common").Type<Partial<CreateEmployeeNotificationSettingDTO>>;
/**
 * Update EmployeeNotificationSetting validation request DTO
 */
export declare class UpdateEmployeeNotificationSettingDTO extends UpdateEmployeeNotificationSettingDTO_base implements IEmployeeNotificationSettingUpdateInput {
}
export {};
