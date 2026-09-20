import { IOrganizationProjectSetting } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { OrganizationProject } from '../organization-project.entity';
declare const UpdateProjectSettingDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<OrganizationProject, "isTasksAutoSync" | "isTasksAutoSyncOnLabel" | "syncTag">>;
export declare class UpdateProjectSettingDTO extends UpdateProjectSettingDTO_base implements IOrganizationProjectSetting {
    readonly customFields?: Record<string, any>;
}
export {};
