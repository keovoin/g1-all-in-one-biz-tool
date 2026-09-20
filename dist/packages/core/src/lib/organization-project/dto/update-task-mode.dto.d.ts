import { IOrganizationProjectUpdateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
import { OrganizationProject } from '../organization-project.entity';
declare const UpdateTaskModeDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<OrganizationProject, "taskListType">>;
/**
 * Update task list view mode DTO validation
 */
export declare class UpdateTaskModeDTO extends UpdateTaskModeDTO_base implements IOrganizationProjectUpdateInput {
}
export {};
