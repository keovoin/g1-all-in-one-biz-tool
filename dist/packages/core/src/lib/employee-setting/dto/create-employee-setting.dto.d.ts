import { IEmployeeSettingCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { EmployeeSetting } from '../employee-setting.entity';
declare const CreateEmployeeSettingDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & EmployeeSetting>;
/**
 * Create Employee Setting DTO request validation
 */
export declare class CreateEmployeeSettingDTO extends CreateEmployeeSettingDTO_base implements IEmployeeSettingCreateInput {
}
export {};
