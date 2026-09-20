import { IScreeningTaskUpdateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../core/dto';
import { ScreeningTask } from '../screening-task.entity';
declare const UpdateScreeningTaskDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Omit<ScreeningTask, "taskId" | "task">>;
/**
 * Update Screening Task data validation request DTO
 */
export declare class UpdateScreeningTaskDTO extends UpdateScreeningTaskDTO_base implements IScreeningTaskUpdateInput {
}
export {};
