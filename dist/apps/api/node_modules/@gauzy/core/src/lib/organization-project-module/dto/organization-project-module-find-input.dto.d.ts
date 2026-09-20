import { ID, IOrganizationProjectModuleFindInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
import { CreateOrganizationProjectModuleDTO } from './create-organization-project-module.dto';
declare const OrganizationProjectModuleFindInputDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Partial<Pick<CreateOrganizationProjectModuleDTO, "projectId" | "name">>>;
/** Organization Project Module query validation DTO */
export declare class OrganizationProjectModuleFindInputDTO extends OrganizationProjectModuleFindInputDTO_base implements IOrganizationProjectModuleFindInput {
    organizationTeamId?: ID;
    organizationSprintId?: ID;
}
export {};
