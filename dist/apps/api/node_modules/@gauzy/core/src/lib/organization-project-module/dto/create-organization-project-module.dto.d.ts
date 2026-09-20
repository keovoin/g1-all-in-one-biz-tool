import { IOrganizationProjectModuleCreateInput } from '@gauzy/contracts';
import { MemberEntityBasedDTO, TenantOrganizationBaseDTO } from './../../core/dto';
import { OrganizationProjectModule } from './../organization-project-module.entity';
declare const CreateOrganizationProjectModuleDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & MemberEntityBasedDTO & Omit<OrganizationProjectModule, "organization" | "organizationId">>;
/**
 * Create Project Module validation request DTO
 */
export declare class CreateOrganizationProjectModuleDTO extends CreateOrganizationProjectModuleDTO_base implements IOrganizationProjectModuleCreateInput {
}
export {};
