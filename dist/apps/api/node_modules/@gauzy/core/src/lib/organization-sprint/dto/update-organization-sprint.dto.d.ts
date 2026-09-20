import { IOrganizationSprintUpdateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { OrganizationSprintDTO } from './organization-sprint.dto';
declare const UpdateOrganizationSprintDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Partial<OrganizationSprintDTO>>;
/**
 * Update Organization Project DTO request validation
 */
export declare class UpdateOrganizationSprintDTO extends UpdateOrganizationSprintDTO_base implements IOrganizationSprintUpdateInput {
}
export {};
