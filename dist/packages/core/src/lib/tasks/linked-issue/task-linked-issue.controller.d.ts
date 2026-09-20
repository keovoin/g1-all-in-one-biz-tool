import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ID, IPagination, ITaskLinkedIssue } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../../core/crud';
import { TaskLinkedIssue } from './task-linked-issue.entity';
import { TaskLinkedIssueService } from './task-linked-issue.service';
import { CreateTaskLinkedIssueDTO, UpdateTaskLinkedIssueDTO } from './dto';
export declare class TaskLinkedIssueController extends CrudController<TaskLinkedIssue> {
    private readonly taskLinkedIssueService;
    private readonly commandBus;
    constructor(taskLinkedIssueService: TaskLinkedIssueService, commandBus: CommandBus);
    /**
     * Finds all task linked issues based on the provided query parameters.
     *
     * @param params - The pagination and filter parameters for the query.
     * @returns A promise that resolves to a paginated list of task linked issues.
     */
    findAll(params: BaseQueryDTO<TaskLinkedIssue>): Promise<IPagination<ITaskLinkedIssue>>;
    /**
     * Creates a new task linked issue.
     *
     * @param entity - The input data for creating a task linked issue.
     * @returns A promise that resolves to the created task linked issue.
     */
    create(entity: CreateTaskLinkedIssueDTO): Promise<ITaskLinkedIssue>;
    /**
     * Updates an existing task linked issue.
     *
     * @param id - The ID of the task linked issue to update.
     * @param entity - The input data for updating the task linked issue.
     * @returns A promise that resolves to the updated task linked issue.
     */
    update(id: ID, entity: UpdateTaskLinkedIssueDTO): Promise<ITaskLinkedIssue>;
    /**
     * Deletes a task linked issue.
     *
     * @param id - The ID of the task linked issue to delete.
     * @returns A promise that resolves to the result of the delete operation.
     */
    delete(id: ID): Promise<DeleteResult>;
    /**
     * Soft deletes a task linked issue record.
     *
     * @param id - The ID of the task linked issue to soft delete.
     * @returns A promise that resolves to the result of the soft delete operation.
     */
    softRemove(id: ID): Promise<any>;
}
