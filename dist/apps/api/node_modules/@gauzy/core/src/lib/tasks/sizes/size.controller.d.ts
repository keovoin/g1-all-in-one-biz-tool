import { IPagination, ITaskSize } from '@gauzy/contracts';
import { TaskSizeService } from './size.service';
import { TaskSize } from './size.entity';
import { TaskSizeQueryDTO } from './dto';
declare const TaskSizeController_base: import("dist/packages/common/src").Type<import("../../core/crud").ICrudController<TaskSize>>;
export declare class TaskSizeController extends TaskSizeController_base {
    protected readonly taskSizeService: TaskSizeService;
    constructor(taskSizeService: TaskSizeService);
    /**
     * GET task sizes by filters
     * If parameters not match, retrieve global task sizes
     *
     * @param params
     * @returns
     */
    fetchAll(params: TaskSizeQueryDTO): Promise<IPagination<ITaskSize>>;
}
export {};
