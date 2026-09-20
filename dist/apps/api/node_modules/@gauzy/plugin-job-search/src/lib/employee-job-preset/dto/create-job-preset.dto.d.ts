import { TenantOrganizationBaseDTO } from '@gauzy/core';
import { IJobPreset } from '@gauzy/contracts';
declare const CreateJobPresetDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO>;
/**
 * Data Transfer Object for creating job presets.
 */
export declare class CreateJobPresetDTO extends CreateJobPresetDTO_base implements IJobPreset {
}
export {};
