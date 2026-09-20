import { ITimerToggleInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../../core/dto';
import { TimeLog } from '../../time-log/time-log.entity';
declare const StartTimerDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<TimeLog, "version" | "projectId" | "source" | "description" | "organizationTeamId" | "organizationContactId" | "taskId" | "logType" | "isBillable">>;
export declare class StartTimerDTO extends StartTimerDTO_base implements ITimerToggleInput {
}
export {};
