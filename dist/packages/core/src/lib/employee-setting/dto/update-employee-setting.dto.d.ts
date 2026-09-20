import { TenantOrganizationBaseDTO } from '../../core/dto';
import { CreateEmployeeSettingDTO } from './create-employee-setting.dto';
declare const UpdateEmployeeSettingDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Omit<CreateEmployeeSettingDTO, "employee" | "employeeId">>;
export declare class UpdateEmployeeSettingDTO extends UpdateEmployeeSettingDTO_base {
}
export {};
