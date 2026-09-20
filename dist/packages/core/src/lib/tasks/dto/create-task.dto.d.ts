import { ITaskCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
import { MentionEmployeeIdsDTO } from '../../mention/dto';
import { Task } from './../task.entity';
declare const CreateTaskDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & MentionEmployeeIdsDTO & Omit<Task, "organization" | "organizationId">>;
/**
 * Create task validation request DTO
 */
export declare class CreateTaskDTO extends CreateTaskDTO_base implements ITaskCreateInput {
}
export {};
