import { DeleteResult, FindOneOptions, UpdateResult } from 'typeorm';
import { ID, ITaskLinkedIssue, ITaskLinkedIssueCreateInput, ITaskLinkedIssueUpdateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../../core/crud';
import { ActivityLogService } from '../../activity-log/activity-log.service';
import { TaskLinkedIssue } from './task-linked-issue.entity';
import { MikroOrmTaskLinkedIssueRepository } from './repository/mikro-orm-linked-issue.repository';
import { TypeOrmTaskLinkedIssueRepository } from './repository/type-orm-linked-issue.repository';
export declare class TaskLinkedIssueService extends TenantAwareCrudService<TaskLinkedIssue> {
    private readonly activityLogService;
    constructor(typeOrmTaskLinkedIssueRepository: TypeOrmTaskLinkedIssueRepository, mikroOrmTaskLinkedIssueRepository: MikroOrmTaskLinkedIssueRepository, activityLogService: ActivityLogService);
    /**
     * Creates a task linked to an issue.
     *
     * @param {ITaskLinkedIssueCreateInput} entity - The input data for creating a task linked issue.
     * @returns {Promise<ITaskLinkedIssue>} The created task linked issue.
     * @throws {HttpException} Throws a Bad Request exception if task creation fails.
     *
     */
    create(entity: ITaskLinkedIssueCreateInput): Promise<ITaskLinkedIssue>;
    /**
     * Updates a task linked issue.
     *
     * @param {ID} id - The ID of the task linked issue to update.
     * @param {ITaskLinkedIssueUpdateInput} input - The input data for updating the task linked issue.
     * @returns {Promise<ITaskLinkedIssue>} The updated task linked issue.
     * @throws {HttpException} Throws a Bad Request exception if the update fails.
     * @throws {NotFoundException} Throws a Not Found exception if the task linked issue does not exist.
     *
     */
    update(id: ID, input: ITaskLinkedIssueUpdateInput): Promise<ITaskLinkedIssue>;
    /**
     * Deletes a task linked issue and logs the deletion activity.
     *
     * @param id - The ID of the task linked issue to delete.
     * @param options - Optional find options for the task linked issue.
     * @returns A promise that resolves to the result of the delete operation.
     */
    delete(id: ID, options?: FindOneOptions<TaskLinkedIssue>): Promise<DeleteResult>;
    /**
     * Soft deletes a task linked issue and logs the deletion activity.
     *
     * @param id - The ID of the task linked issue to soft delete.
     * @returns A promise that resolves to the result of the soft delete operation or the deleted entity.
     */
    softDelete(id: ID): Promise<TaskLinkedIssue | UpdateResult>;
    /**
     * Deletes an activity log for a given task linked issue.
     *
     * @param id - The ID of the task linked issue to delete.
     */
    private deleteActivityLog;
}
