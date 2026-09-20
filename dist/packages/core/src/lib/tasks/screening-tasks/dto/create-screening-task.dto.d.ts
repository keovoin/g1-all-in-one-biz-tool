import { IScreeningTaskCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../core/dto';
import { MentionEmployeeIdsDTO } from '../../../mention/dto';
import { ScreeningTask } from '../screening-task.entity';
declare const CreateScreeningTaskDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & MentionEmployeeIdsDTO & Omit<ScreeningTask, "status">>;
/**
 * Create Screening Task data validation request DTO
 */
export declare class CreateScreeningTaskDTO extends CreateScreeningTaskDTO_base implements IScreeningTaskCreateInput {
}
export {};
