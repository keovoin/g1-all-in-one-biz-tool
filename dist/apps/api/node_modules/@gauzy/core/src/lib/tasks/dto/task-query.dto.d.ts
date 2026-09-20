import { BaseQueryDTO } from '../../core/crud';
import { TaskAdvancedFilterDTO } from './task-advanced-filter.dto';
import { Task } from '../task.entity';
export declare class TaskQueryDTO extends BaseQueryDTO<Task> {
    /**
     * Advanced filters for retrieving tasks.
     */
    filters?: TaskAdvancedFilterDTO;
}
