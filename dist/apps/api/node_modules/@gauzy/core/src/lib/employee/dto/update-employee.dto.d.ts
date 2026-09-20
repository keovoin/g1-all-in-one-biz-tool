import { IEmployeeUpdateInput } from '@gauzy/contracts';
import { UpdateProfileDTO } from './update-profile.dto';
import { Employee } from '../employee.entity';
declare const UpdateEmployeeDTO_base: import("@nestjs/mapped-types").MappedType<UpdateProfileDTO & Pick<Employee, "show_anonymous_bonus" | "show_average_bonus" | "show_average_expenses" | "show_average_income" | "show_billrate" | "show_payperiod" | "show_start_work_on"> & Pick<Employee, "isActive" | "isArchived" | "allowManualTime" | "allowModifyTime" | "allowDeleteTime" | "allowScreenshotCapture" | "allowAgentAppExit" | "allowLogoutFromAgentApp" | "trackKeyboardMouseActivity" | "trackAllDisplays" | "isJobSearchActive" | "isVerified" | "isVetted" | "isTrackingEnabled" | "isOnline" | "isTrackingTime">>;
/**
 * Only SUPER_ADMIN/ADMIN updates these fields
 * Private fields DTO
 */
export declare class UpdateEmployeeDTO extends UpdateEmployeeDTO_base implements IEmployeeUpdateInput {
}
export {};
