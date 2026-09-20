import { DeleteResult, UpdateResult } from 'typeorm';
import { ID, IDailyPlan, IDailyPlanTasksUpdateInput, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../../core/crud';
import { CreateDailyPlanDTO, RemoveTaskFromManyPlansDTO, UpdateDailyPlanDTO } from './dto';
import { DailyPlan } from './daily-plan.entity';
import { DailyPlanService } from './daily-plan.service';
export declare class DailyPlanController extends CrudController<DailyPlan> {
    private readonly dailyPlanService;
    constructor(dailyPlanService: DailyPlanService);
    /**
     * Retrieves the daily plans for the currently authenticated user.
     *
     * This endpoint allows users to fetch their own daily plans with support for pagination.
     *
     * @param params - Pagination and filtering parameters for retrieving daily plans.
     * @returns A paginated list of daily plans for the authenticated user.
     */
    getMyPlans(params: BaseQueryDTO<DailyPlan>): Promise<IPagination<IDailyPlan>>;
    /**
     * Retrieves daily plans for the team members based on the provided query parameters.
     *
     * Accessible by users with appropriate permissions. Supports pagination and filtering.
     *
     * @param params - Pagination and filtering parameters for fetching team daily plans.
     * @returns A paginated list of team daily plans.
     */
    getTeamDailyPlans(params: BaseQueryDTO<DailyPlan>): Promise<IPagination<IDailyPlan>>;
    /**
     * Retrieves daily plans for a specific employee.
     *
     * Requires appropriate permissions. Supports pagination.
     *
     * @param employeeId - The ID of the employee whose daily plans are to be fetched.
     * @param params - Pagination and filtering parameters.
     * @returns A paginated list of daily plans for the specified employee.
     */
    getEmployeeDailyPlans(employeeId: ID, params: BaseQueryDTO<DailyPlan>): Promise<IPagination<IDailyPlan>>;
    /**
     * Retrieves daily plans associated with a specific task.
     *
     * Requires appropriate permissions. Supports pagination and filtering.
     *
     * @param taskId - The ID of the task whose related daily plans are to be retrieved.
     * @param params - Pagination and filtering parameters.
     * @returns A paginated list of daily plans linked to the given task.
     */
    getDailyPlansForTaskId(taskId: ID, params: BaseQueryDTO<IDailyPlan>): Promise<IPagination<IDailyPlan>>;
    /**
     * Add a task to a specified daily plan.
     *
     * Requires appropriate permissions to edit or create a daily plan.
     *
     * @param planId - The unique identifier of the daily plan to which the task will be added.
     * @param input - The task input including taskId, employeeId, and organizationId.
     * @returns The updated daily plan with the newly added task.
     */
    addTaskToDailyPlan(planId: ID, input: IDailyPlanTasksUpdateInput): Promise<IDailyPlan>;
    /**
     * Remove a task from a specified daily plan.
     *
     * Requires appropriate permissions to modify the daily plan.
     *
     * @param planId - The ID of the daily plan from which the task will be removed.
     * @param input - Object containing taskId and other related identifiers to perform the removal.
     * @returns The updated daily plan after removing the task.
     */
    removeTaskFromDailyPlan(planId: ID, input: IDailyPlanTasksUpdateInput): Promise<IDailyPlan>;
    /**
     * Delete a task from multiple daily plans.
     *
     * Requires appropriate data such as employee ID and organization ID to identify which plans to update.
     *
     * @param taskId - The unique identifier of the task to be removed from daily plans.
     * @param input - An object containing details (e.g. employeeId, organizationId) to locate affected plans.
     * @returns An array of updated daily plans after the task has been removed.
     */
    removeTaskFromManyPlans(taskId: ID, input: RemoveTaskFromManyPlansDTO): Promise<IDailyPlan[]>;
    /**
     * Retrieves all daily plans based on the provided query parameters.
     *
     * Requires appropriate permissions to view organization data.
     * Supports pagination and filtering.
     *
     * @param params - Query parameters for pagination and optional filtering.
     * @returns A paginated list of all daily plans.
     */
    get(params: BaseQueryDTO<DailyPlan>): Promise<IPagination<IDailyPlan>>;
    /**
     * Creates a new daily plan.
     *
     * Requires appropriate permissions to create a daily plan.
     * Validates and transforms input data using a validation pipe.
     *
     * @param entity - The data required to create a daily plan.
     * @returns The newly created daily plan.
     */
    create(entity: CreateDailyPlanDTO): Promise<IDailyPlan>;
    /**
     * Updates an existing daily plan by ID.
     *
     * Requires appropriate permissions to update a daily plan.
     * Applies validation and transformation to the request body.
     *
     * @param id - The ID of the daily plan to update.
     * @param entity - The updated data for the daily plan.
     * @returns The updated daily plan or the update result from TypeORM.
     */
    update(id: ID, entity: UpdateDailyPlanDTO): Promise<IDailyPlan | UpdateResult>;
    /**
     * Deletes a daily plan by its ID.
     *
     * Requires appropriate permissions to perform the deletion.
     *
     * @param planId - The ID of the daily plan to be deleted.
     * @returns A result object indicating the outcome of the delete operation.
     */
    delete(planId: ID): Promise<DeleteResult>;
}
