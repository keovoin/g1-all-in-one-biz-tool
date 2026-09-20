import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ITask, IPagination, ID } from '@gauzy/contracts';
import { CountQueryDTO } from './../shared/dto';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { CreateTaskDTO, GetTaskByIdDTO, TaskDateFilterInputDTO, TaskMaxNumberQueryDTO, TaskQueryDTO, UpdateTaskDTO } from './dto';
export declare class TaskController extends CrudController<Task> {
    private readonly taskService;
    private readonly commandBus;
    constructor(taskService: TaskService, commandBus: CommandBus);
    /**
     * GET task count
     *
     * @param options The filter options for counting tasks.
     * @returns The total number of tasks.
     */
    getCount(options: CountQueryDTO<Task>): Promise<number>;
    /**
     * GET tasks by pagination
     *
     * @param params The pagination and filter parameters.
     * @returns A paginated list of tasks.
     */
    pagination(params: TaskQueryDTO): Promise<IPagination<ITask>>;
    /**
     * GET maximum task number
     *
     * @param options The query options to filter the tasks by project.
     * @returns The maximum task number for a given project.
     */
    getMaxTaskNumberByProject(options: TaskMaxNumberQueryDTO): Promise<number>;
    /**
     * GET my tasks
     *
     * @param params The filter and pagination options for retrieving tasks.
     * @returns A paginated list of tasks assigned to the current user.
     */
    findMyTasks(params: BaseQueryDTO<Task>): Promise<IPagination<ITask>>;
    /**
     * GET employee tasks
     *
     * @param params The filter and pagination options for retrieving employee tasks.
     * @returns A paginated list of tasks assigned to the specified employee.
     */
    findEmployeeTask(params: TaskQueryDTO): Promise<IPagination<ITask>>;
    /**
     * GET my team tasks
     *
     * @param params The filter and pagination options for retrieving team tasks.
     * @returns A paginated list of tasks assigned to the current user's team.
     */
    findTeamTasks(params: TaskQueryDTO): Promise<IPagination<ITask>>;
    /**
     * GET module tasks
     *
     * @param params The filter and pagination options for retrieving module tasks.
     * @returns A paginated list of tasks by module.
     */
    findModuleTasks(params: TaskQueryDTO): Promise<IPagination<ITask>>;
    /**
     * Retrieves tasks based on the provided date filters for startDate and dueDate.
     *
     * @function getTasksByDateFilters
     * @param {TaskDateFilterInputDTO} params - The DTO containing the date filters for the tasks.
     */
    getTasksByDateFilters(params: TaskDateFilterInputDTO): Promise<IPagination<ITask>>;
    /**
     * GET view tasks
     *
     * @param params The filter options for retrieving view tasks.
     * @returns A paginated list of tasks by view filters.
     */
    findTasksByViewQuery(viewId: ID): Promise<IPagination<ITask>>;
    /**
     * GET task by ID
     *
     * @param id The ID of the task.
     * @param params The options for task retrieval.
     * @returns The task with the specified ID.
     */
    findById(id: ID, params: GetTaskByIdDTO): Promise<Task>;
    /**
     * GET tasks by employee
     *
     * @param employeeId The ID of the employee.
     * @param params The pagination and filter parameters for tasks.
     * @returns A list of tasks assigned to the specified employee.
     */
    getAllTasksByEmployee(employeeId: ID, params: TaskQueryDTO): Promise<ITask[]>;
    /**
     * GET all tasks
     *
     * @param params The pagination and filter parameters for retrieving tasks.
     * @returns A paginated list of all tasks.
     */
    findAll(params: TaskQueryDTO): Promise<IPagination<ITask>>;
    /**
     * POST create a task
     *
     * @param entity The data for creating the task.
     * @returns The created task.
     */
    create(entity: CreateTaskDTO): Promise<ITask>;
    /**
     * PUT update an existing task
     *
     * @param id The ID of the task to update.
     * @param entity The data for updating the task.
     * @returns The updated task.
     */
    update(id: ID, entity: UpdateTaskDTO): Promise<ITask>;
    /**
     * DELETE task by ID
     *
     * @param id The ID of the task to delete.
     * @returns The result of the deletion.
     */
    delete(id: ID): Promise<DeleteResult>;
    /**
     * DELETE employee from team tasks
     *
     * Unassign an employee from tasks associated with a specific organization team.
     *
     * @param employeeId The ID of the employee to be unassigned from tasks.
     * @param organizationTeamId The ID of the organization team from which to unassign the employee.
     * @returns A Promise that resolves with the result of the no assignment.
     */
    deleteEmployeeFromTasks(employeeId: ID, organizationTeamId: ID): Promise<void>;
}
