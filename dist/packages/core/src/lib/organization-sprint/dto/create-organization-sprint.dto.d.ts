import { IOrganizationSprintCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
import { OrganizationSprintDTO } from './organization-sprint.dto';
declare const CreateOrganizationSprintDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & OrganizationSprintDTO>;
/**
 * Create Organization Sprint DTO request validation
 */
export declare class CreateOrganizationSprintDTO extends CreateOrganizationSprintDTO_base implements IOrganizationSprintCreateInput {
}
export {};
