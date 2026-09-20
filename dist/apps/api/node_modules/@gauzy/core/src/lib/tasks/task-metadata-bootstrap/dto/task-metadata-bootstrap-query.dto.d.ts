import { ID, ITaskMetadataBootstrapQuery, TaskMetadataSection } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../core/dto/tenant-organization-base.dto';
declare const TaskMetadataBootstrapQueryDTO_base: import("@nestjs/common").Type<Pick<TenantOrganizationBaseDTO, "organizationId">>;
export declare class TaskMetadataBootstrapQueryDTO extends TaskMetadataBootstrapQueryDTO_base implements ITaskMetadataBootstrapQuery {
    readonly organizationTeamId?: ID;
    readonly projectId?: ID;
    readonly include?: TaskMetadataSection[];
}
export {};
