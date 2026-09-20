import { IGetJobPresetInput } from '@gauzy/contracts';
import { EmployeeFeatureDTO, TenantOrganizationBaseDTO } from '@gauzy/core';
declare const JobPresetQueryDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Partial<Pick<EmployeeFeatureDTO, keyof EmployeeFeatureDTO>>>;
export declare class JobPresetQueryDTO extends JobPresetQueryDTO_base implements IGetJobPresetInput {
}
export {};
