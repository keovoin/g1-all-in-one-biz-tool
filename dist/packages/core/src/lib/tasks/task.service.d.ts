import { EventBus } from '@nestjs/cqrs';
import { ID, IEmployee, IGetTaskOptions, IPagination, ITask, ITaskUpdateInput, ITaskDateFilterInput, IAdvancedTaskFiltering } from '@gauzy/contracts';
import { TenantAwareCrudService, BaseQueryDTO } from './../core/crud';
import { IPartialEntity } from './../core/crud/icrud.service';
import { TaskViewService } from './views/view.service';
import { EntitySubscriptionService } from '../entity-subscription/entity-subscription.service';
import { MentionService } from '../mention/mention.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { EmployeeNotificationService } from '../employee-notification/employee-notification.service';
import { EmployeeRecentVisitService } from '../employee-recent-visit/employee-recent-visit.service';
import { Task } from './task.entity';
import { TypeOrmOrganizationSprintTaskHistoryRepository } from './../organization-sprint/repository/type-orm-organization-sprint-task-history.repository';
import { GetTaskByIdDTO } from './dto';
import { TypeOrmTaskRepository } from './repository/type-orm-task.repository';
import { MikroOrmTaskRepository } from './repository/mikro-orm-task.repository';
export declare class TaskService extends TenantAwareCrudService<Task> {
    readonly typeOrmTaskRepository: TypeOrmTaskRepository;
    readonly mikroOrmTaskRepository: MikroOrmTaskRepository;
    readonly typeOrmOrganizationSprintTaskHistoryRepository: TypeOrmOrganizationSprintTaskHistoryRepository;
    private readonly _eventBus;
    private readonly _taskViewService;
    private readonly _entitySubscriptionService;
    private readonly _mentionService;
    private readonly _activityLogService;
    private readonly _employeeNotificationService;
    private readonly _employeeRecentVisitService;
    constructor(typeOrmTaskRepository: TypeOrmTaskRepository, mikroOrmTaskRepository: MikroOrmTaskRepository, typeOrmOrganizationSprintTaskHistoryRepository: TypeOrmOrganizationSprintTaskHistoryRepository, _eventBus: EventBus, _taskViewService: TaskViewService, _entitySubscriptionService: EntitySubscriptionService, _mentionService: MentionService, _activityLogService: ActivityLogService, _employeeNotificationService: EmployeeNotificationService, _employeeRecentVisitService: EmployeeRecentVisitService);
    /**
     * Creates a task, sanitizing the rich-text `description` HTML through the shared
     * server-side allowlist before persisting (see `sanitizeRichHtml`).
     *
     * @param entity - The task creation input
     * @returns The created task
     */
    create(entity: IPartialEntity<Task>): Promise<Task>;
    /**
     * Update task, if already exist
     *
     * @param id - The ID of the task to update
     * @param input - The data to update the task with
     * @returns The updated task
     */
    update(id: ID, input: Partial<ITaskUpdateInput>): Promise<ITask>;
    /**
     * Synchronizes the task's mention records with the employees mentioned in the update.
     *
     * Best-effort by design: the task itself is already persisted by the time this runs, so a
     * mention-sync failure is logged and swallowed instead of failing the update.
     *
     * @param taskId - The ID of the updated task
     * @param mentionEmployeeIds - The IDs of the employees mentioned in the description
     */
    private syncTaskMentions;
    /**
     * Unsubscribes the members who were unassigned from the task.
     *
     * Best-effort by design: failures are logged and swallowed so subscription cleanup can never
     * fail an update that already succeeded.
     *
     * @param members - The members that are no longer assigned to the task
     * @param taskId - The ID of the updated task
     * @param organizationId - The organization of the updated task
     * @param tenantId - The tenant of the updated task
     */
    private unsubscribeRemovedMembers;
    /**
     * Subscribes the newly assigned members to the task and notifies them of the assignment.
     *
     * Best-effort by design: failures are logged and swallowed so the subscription/notification
     * path can never fail an update that already succeeded.
     *
     * @param members - The members newly assigned to the task
     * @param task - The task as loaded BEFORE the update (source of the notified id and title)
     * @param updatedTaskId - The ID of the updated task (subscription target)
     * @param organizationId - The organization of the updated task
     * @param tenantId - The tenant of the updated task
     * @param user - The user performing the update
     */
    private subscribeNewMembers;
    /**
     * Retrieves a task by its ID and includes optional related data.
     *
     * @param id The unique identifier of the task.
     * @param params Additional parameters for fetching task details, including related entities.
     * @returns A Promise that resolves to the task entity.
     */
    findById(id: ID, params: GetTaskByIdDTO): Promise<ITask>;
    /**
     * Retrieves a paginated list of tasks, with optional advanced filters applied.
     *
     * @param options - Pagination options including limit, page, and sorting.
     * @param filters - Optional filters for advanced task filtering.
     * @returns A promise that resolves to a paginated list of tasks.
     * @throws If an error occurs during the retrieval process.
     */
    findAll(options: BaseQueryDTO<Task> & IAdvancedTaskFiltering): Promise<IPagination<Task>>;
    /**
     * Recursively searches for the parent epic of a given task (issue) using a SQL recursive query.
     *
     * @param issueId The ID of the task (issue) to start the search from.
     * @returns A Promise that resolves to the epic task if found, otherwise null.
     */
    findParentUntilEpic(issueId: ID): Promise<Task | null>;
    /**
     * GET my tasks
     *
     * @param options
     * @returns
     */
    getMyTasks(options: BaseQueryDTO<Task>): Promise<{
        items: Task[];
        total: number;
    }>;
    /**
     * Find employee tasks
     *
     * @param options - Pagination options including limit, page, and sorting.
     * @param filters - Optional filters for advanced task filtering.
     * @returns
     */
    getEmployeeTasks(options: BaseQueryDTO<Task> & IAdvancedTaskFiltering): Promise<{
        items: Task[];
        total: number;
    }>;
    /**
     * GET all tasks by employee
     *
     * @param employeeId - The employee ID for whom retrieve tasks
     * @param options - Pagination options including limit, page, and sorting.
     * @param filters - Optional filters for advanced task filtering.
     * @returns
     */
    getAllTasksByEmployee(employeeId: IEmployee['id'], options: BaseQueryDTO<Task> & IAdvancedTaskFiltering): Promise<Task[]>;
    /**
     * GET team tasks
     *
     * @param options - Pagination options including limit, page, and sorting.
     * @param filters - Optional filters for advanced task filtering.
     * @returns
     */
    findTeamTasks(options: BaseQueryDTO<Task> & IAdvancedTaskFiltering): Promise<IPagination<ITask>>;
    /**
     * GET tasks by pagination with filtering options.
     *
     * @param options The pagination and filtering parameters.
     * @param filters - Optional filters for advanced task filtering.
     * @returns A Promise that resolves to a paginated list of tasks.
     */
    pagination(options: BaseQueryDTO<Task> & IAdvancedTaskFiltering): Promise<IPagination<ITask>>;
    /**
     * GET maximum task number by project filter
     *
     * @param options The filtering options including tenant, organization, and project details.
     * @returns A Promise that resolves to the maximum task number for the given project.
     */
    getMaxTaskNumberByProject(options: IGetTaskOptions): Promise<number>;
    /**
     * Unassign employee from team task
     * @param employeeId
     * @param organizationTeamId
     */
    unassignEmployeeFromTeamTasks(employeeId: string, organizationTeamId?: string): Promise<void>;
    /**
     * Retrieves module tasks based on the provided options.
     *
     * @param options - The pagination options and filters for querying tasks.
     * @param filters - Optional filters for advanced task filtering.
     * @returns A promise that resolves with pagination task items and total count.
     */
    findModuleTasks(options: BaseQueryDTO<Task> & IAdvancedTaskFiltering): Promise<IPagination<ITask>>;
    /**
     * @description Get tasks by views query
     * @param {ID} viewId - View ID
     * @returns {Promise<IPagination<ITask>>} A Promise resolved to paginated found tasks and total matching query filters
     * @memberof TaskService
     */
    findTasksByViewQuery(viewId: ID): Promise<IPagination<ITask>>;
    /**
     * Retrieves tasks based on the provided date filters for startDate and dueDate.
     *
     * @function getTasksByDateFilters
     * @param {ITaskDateFilterInput} params - The query params containing the date filters for the tasks.
     *
     * @returns {Promise<IPagination<ITask>>} A promise that resolves to an paginated tasks filtered by the provided dates.
     *
     * @throws {Error} Will throw an error if there is a problem with the database query.
     */
    getTasksByDateFilters(params: ITaskDateFilterInput): Promise<IPagination<ITask>>;
    /**
     * Constructs advanced `where` conditions for filtering tasks based on the provided filters and existing conditions.
     *
     * @private
     * @param {ITaskAdvancedFilter | IGetTasksByViewFilters} [filters] - Advanced filtering criteria for tasks, including projects, teams, sprints, and more.
     * @param {FindOptionsWhere<Task>} [where] - Existing `where` conditions to be merged with the filters.
     * @returns {FindOptionsWhere<Task>} A `where` condition object to be used in database queries.
     */
    private buildAdvancedWhereCondition;
}
