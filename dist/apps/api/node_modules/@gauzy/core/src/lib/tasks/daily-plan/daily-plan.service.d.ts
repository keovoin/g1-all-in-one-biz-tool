import { UpdateResult } from 'typeorm';
import { ID, IDailyPlan, IDailyPlanCreateInput, IDailyPlansTasksUpdateInput, IDailyPlanTasksUpdateInput, IDailyPlanUpdateInput, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from '../../core/crud';
import { EmployeeService } from '../../employee/employee.service';
import { ManagedEmployeeService } from '../../employee/managed-employee.service';
import { TaskService } from '../task.service';
import { DailyPlan } from './daily-plan.entity';
import { MikroOrmDailyPlanRepository } from './repository/mikro-orm-daily-plan.repository';
import { TypeOrmDailyPlanRepository } from './repository/type-orm-daily-plan.repository';
export declare class DailyPlanService extends TenantAwareCrudService<DailyPlan> {
    protected readonly typeOrmDailyPlanRepository: TypeOrmDailyPlanRepository;
    protected readonly mikroOrmDailyPlanRepository: MikroOrmDailyPlanRepository;
    private readonly _employeeService;
    private readonly _taskService;
    private readonly _managedEmployeeService;
    constructor(typeOrmDailyPlanRepository: TypeOrmDailyPlanRepository, mikroOrmDailyPlanRepository: MikroOrmDailyPlanRepository, _employeeService: EmployeeService, _taskService: TaskService, _managedEmployeeService: ManagedEmployeeService);
    /**
     * Create or update a DailyPlan. If the given day already has a DailyPlan,
     * update it with the provided task. Otherwise, create a new DailyPlan.
     *
     * @param partialEntity - Data to create or update the DailyPlan
     * @returns The created or updated DailyPlan
     */
    createDailyPlan(partialEntity: IDailyPlanCreateInput): Promise<IDailyPlan>;
    /**
     * Retrieves daily plans with pagination and additional query options.
     *
     * @param options - Pagination and additional query options for filtering and retrieving daily plans.
     * @returns A promise that resolves to an object containing the list of daily plans and the total count.
     * @throws BadRequestException - If there's an error during the query.
     */
    getAllPlans(options: BaseQueryDTO<DailyPlan>, employeeId?: ID): Promise<IPagination<IDailyPlan>>;
    /**
     * Retrieves daily plans for a specific employee with pagination and additional query options.
     *
     * @param employeeId - The ID of the employee for whom to retrieve daily plans.
     * @param options - Pagination and additional query options for filtering and retrieving daily plans.
     * @returns A promise that resolves to an object containing the list of daily plans and the total count.
     * @throws BadRequestException - If there's an error during the query.
     */
    getDailyPlansByEmployee(options: BaseQueryDTO, employeeId?: ID): Promise<IPagination<IDailyPlan>>;
    /**
     * Retrieves daily plans for all employees of a specific team with pagination and additional query options.
     *
     * @param teamId - The ID of the team for whom to retrieve daily plans.
     * @param options - Pagination and additional query options for filtering and retrieving daily plans.
     * @returns A promise that resolves to an object containing the list of daily plans and the total count.
     * @throws BadRequestException - If there's an error during the query.
     */
    getTeamDailyPlans(options: BaseQueryDTO<DailyPlan>): Promise<IPagination<IDailyPlan>>;
    /**
     * Retrieves daily plans for the current employee based on given pagination options.
     *
     * @param options Pagination options for fetching daily plans.
     * @returns A promise resolving to daily plans for the current employee.
     */
    getMyPlans(options: BaseQueryDTO<DailyPlan>): Promise<IPagination<IDailyPlan>>;
    /**
     * Fetches a daily plan with manager access control.
     * Checks if the current user has permission to access the plan (either global permission or manager access).
     *
     * @param planId - The ID of the daily plan
     * @param employeeId - The employee ID who owns the plan
     * @param tenantId - The tenant ID
     * @param organizationId - The organization ID
     * @returns The daily plan with tasks relation
     * @throws NotFoundException if plan doesn't exist or user doesn't have access
     */
    private getManagedDailyPlanOrThrow;
    /**
     * Add a task to a specified daily plan.
     *
     * @param planId - The unique identifier of the daily plan to which the task will be added.
     * @param input - An object containing details about the task to add, including task ID, employee ID, and organization ID.
     * @returns The updated daily plan with the newly added task.
     */
    addTaskToPlan(planId: ID, input: IDailyPlanTasksUpdateInput): Promise<IDailyPlan>;
    /**
     * Delete task from a given daily plan
     *
     * @param  planId The unique identifier of the daily plan to which the task will be removed.
     * @param input - An object containing details about the task to remove, including task ID, employee ID, and organization ID.
     * @returns The updated daily plan without the deleted task.
     */
    removeTaskFromPlan(planId: ID, input: IDailyPlanTasksUpdateInput): Promise<IDailyPlan>;
    /**
     * Delete task from a many daily plans
     *
     * @param  taskId The unique identifier of the task to removed from daily plans.
     * @param input - An object containing details about the plans to update, including employee ID, and organization ID.
     * @returns The updated daily plans without the deleted task.
     */
    removeTaskFromManyPlans(taskId: ID, input: IDailyPlansTasksUpdateInput): Promise<IDailyPlan[]>;
    /**
     * UPDATE Daily plan
     *
     * @param id - The unique identifier of the daily plan to be updated.
     * @param partialEntity - An object with data to update, including organization ID and employee ID.
     * @returns The updated daily plan including related tasks.
     * @memberof DailyPlanService
     */
    updateDailyPlan(id: ID, partialEntity: IDailyPlanUpdateInput): Promise<IDailyPlan | UpdateResult>;
    /**
     * Retrieves daily plans for a specific task including employee
     * @param options pagination and additional query options
     * @param taskId - The ID of the task for whom to retrieve daily plans.
     * @returns A promise that resolves to an object containing the list of plans and total count
     */
    getDailyPlansByTask(options: BaseQueryDTO, taskId: ID): Promise<IPagination<IDailyPlan>>;
}
