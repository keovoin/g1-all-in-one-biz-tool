import { IGetTaskById } from '@gauzy/contracts';
import { FindOptionsQueryDTO } from '../../core/crud';
import { Task } from '../../core/entities/internal';
/**
 * GET task by Id DTO validation
 */
export declare class GetTaskByIdDTO extends FindOptionsQueryDTO<Task> implements IGetTaskById {
    includeRootEpic?: boolean;
}
