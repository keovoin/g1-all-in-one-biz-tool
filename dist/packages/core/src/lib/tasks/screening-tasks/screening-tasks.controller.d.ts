import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ID, IPagination, IScreeningTask } from '@gauzy/contracts';
import { CrudController, FindOptionsQueryDTO, BaseQueryDTO } from '../../core/crud';
import { ScreeningTask } from './screening-task.entity';
import { ScreeningTasksService } from './screening-tasks.service';
import { CreateScreeningTaskDTO, UpdateScreeningTaskDTO } from './dto';
export declare class ScreeningTasksController extends CrudController<ScreeningTask> {
    private readonly screeningTasksService;
    private readonly commandBus;
    constructor(screeningTasksService: ScreeningTasksService, commandBus: CommandBus);
    /**
     * Find all screening tasks with pagination.
     *
     * @param params - Pagination parameters and optional filters.
     * @returns A paginated response containing screening tasks.
     */
    findAll(params: BaseQueryDTO<ScreeningTask>): Promise<IPagination<IScreeningTask>>;
    /**
     * Find a screening task by its unique identifier.
     *
     * @param id - The UUID of the screening task.
     * @param params - Optional query parameters for additional filtering.
     * @returns The screening task that matches the given ID.
     */
    findById(id: ID, params: FindOptionsQueryDTO<ScreeningTask>): Promise<IScreeningTask>;
    /**
     * Creates a new screening task.
     *
     * @param entity - The DTO containing data required to create a new screening task.
     * @returns A promise that resolves to the newly created screening task.
     */
    create(entity: CreateScreeningTaskDTO): Promise<IScreeningTask>;
    /**
     * Updates an existing screening task.
     *
     * @param id - The UUID of the screening task to update.
     * @param entity - The DTO containing updated screening task data.
     * @returns A promise that resolves to the updated screening task.
     */
    update(id: ID, entity: UpdateScreeningTaskDTO): Promise<IScreeningTask>;
    /**
     * Delete a screening task by its unique identifier.
     *
     * @param id - The UUID of the screening task to delete.
     * @returns A DeleteResult indicating the outcome of the deletion.
     */
    delete(id: ID): Promise<DeleteResult>;
}
