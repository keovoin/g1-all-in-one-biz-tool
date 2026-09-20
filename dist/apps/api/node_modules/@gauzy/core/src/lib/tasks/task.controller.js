"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("./../shared/decorators");
const dto_1 = require("./../shared/dto");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const crud_1 = require("./../core/crud");
const task_service_1 = require("./task.service");
const commands_1 = require("./commands");
const dto_2 = require("./dto");
let TaskController = class TaskController extends crud_1.CrudController {
    constructor(taskService, commandBus) {
        super(taskService);
        this.taskService = taskService;
        this.commandBus = commandBus;
    }
    /**
     * GET task count
     *
     * @param options The filter options for counting tasks.
     * @returns The total number of tasks.
     */
    async getCount(options) {
        return this.taskService.countBy(options);
    }
    /**
     * GET tasks by pagination
     *
     * @param params The pagination and filter parameters.
     * @returns A paginated list of tasks.
     */
    async pagination(params) {
        return this.taskService.pagination(params);
    }
    /**
     * GET maximum task number
     *
     * @param options The query options to filter the tasks by project.
     * @returns The maximum task number for a given project.
     */
    async getMaxTaskNumberByProject(options) {
        return this.taskService.getMaxTaskNumberByProject(options);
    }
    /**
     * GET my tasks
     *
     * @param params The filter and pagination options for retrieving tasks.
     * @returns A paginated list of tasks assigned to the current user.
     */
    async findMyTasks(params) {
        return this.taskService.getMyTasks(params);
    }
    /**
     * GET employee tasks
     *
     * @param params The filter and pagination options for retrieving employee tasks.
     * @returns A paginated list of tasks assigned to the specified employee.
     */
    async findEmployeeTask(params) {
        return this.taskService.getEmployeeTasks(params);
    }
    /**
     * GET my team tasks
     *
     * @param params The filter and pagination options for retrieving team tasks.
     * @returns A paginated list of tasks assigned to the current user's team.
     */
    async findTeamTasks(params) {
        return this.taskService.findTeamTasks(params);
    }
    /**
     * GET module tasks
     *
     * @param params The filter and pagination options for retrieving module tasks.
     * @returns A paginated list of tasks by module.
     */
    async findModuleTasks(params) {
        return this.taskService.findModuleTasks(params);
    }
    /**
     * Retrieves tasks based on the provided date filters for startDate and dueDate.
     *
     * @function getTasksByDateFilters
     * @param {TaskDateFilterInputDTO} params - The DTO containing the date filters for the tasks.
     */
    async getTasksByDateFilters(params) {
        return this.taskService.getTasksByDateFilters(params);
    }
    /**
     * GET view tasks
     *
     * @param params The filter options for retrieving view tasks.
     * @returns A paginated list of tasks by view filters.
     */
    async findTasksByViewQuery(viewId) {
        return this.taskService.findTasksByViewQuery(viewId);
    }
    /**
     * GET task by ID
     *
     * @param id The ID of the task.
     * @param params The options for task retrieval.
     * @returns The task with the specified ID.
     */
    async findById(id, params) {
        return this.taskService.findById(id, params);
    }
    /**
     * GET tasks by employee
     *
     * @param employeeId The ID of the employee.
     * @param params The pagination and filter parameters for tasks.
     * @returns A list of tasks assigned to the specified employee.
     */
    async getAllTasksByEmployee(employeeId, params) {
        return this.taskService.getAllTasksByEmployee(employeeId, params);
    }
    /**
     * GET all tasks
     *
     * @param params The pagination and filter parameters for retrieving tasks.
     * @returns A paginated list of all tasks.
     */
    async findAll(params) {
        return this.taskService.findAll(params);
    }
    /**
     * POST create a task
     *
     * @param entity The data for creating the task.
     * @returns The created task.
     */
    async create(entity) {
        return this.commandBus.execute(new commands_1.TaskCreateCommand(entity));
    }
    /**
     * PUT update an existing task
     *
     * @param id The ID of the task to update.
     * @param entity The data for updating the task.
     * @returns The updated task.
     */
    async update(id, entity) {
        return this.commandBus.execute(new commands_1.TaskUpdateCommand(id, entity));
    }
    /**
     * DELETE task by ID
     *
     * @param id The ID of the task to delete.
     * @returns The result of the deletion.
     */
    async delete(id) {
        return this.taskService.delete(id);
    }
    /**
     * DELETE employee from team tasks
     *
     * Unassign an employee from tasks associated with a specific organization team.
     *
     * @param employeeId The ID of the employee to be unassigned from tasks.
     * @param organizationTeamId The ID of the organization team from which to unassign the employee.
     * @returns A Promise that resolves with the result of the no assignment.
     */
    async deleteEmployeeFromTasks(employeeId, organizationTeamId) {
        return this.taskService.unassignEmployeeFromTeamTasks(employeeId, organizationTeamId);
    }
};
exports.TaskController = TaskController;
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)('/count'),
    (0, pipes_1.UseValidationPipe)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get the total count of tasks.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Task count retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input.' }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CountQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    (0, swagger_1.ApiOperation)({ summary: 'Get tasks by pagination.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Tasks retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input.' }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.TaskQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get the maximum task number by project.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Maximum task number retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'No records found.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)('/max-number'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.TaskMaxNumberQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "getMaxTaskNumberByProject", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get tasks assigned to the current user.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Tasks retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'No records found.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)('/me'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "findMyTasks", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get tasks assigned to a specific employee.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Tasks retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'No records found.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)('/employee'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.TaskQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "findEmployeeTask", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get tasks assigned to the current user's team." }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Tasks retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'No records found.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)('/team'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.TaskQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "findTeamTasks", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get tasks by module.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Tasks retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'No records found.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)('/module'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.TaskQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "findModuleTasks", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get tasks by start and due dates filters.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Tasks retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'No records found.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)('/filter-by-date'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.TaskDateFilterInputDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "getTasksByDateFilters", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get tasks by view query filter.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Tasks retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'No records found.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)('/view/:id'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "findTasksByViewQuery", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get task by ID.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Task retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Task not found.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_2.GetTaskByIdDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get tasks assigned to a specific employee.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Tasks retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'No records found.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)('/employee/:id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_2.TaskQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "getAllTasksByEmployee", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all tasks.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Tasks retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'No tasks found.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TASK_VIEW),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.TaskQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new task.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The task has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TASK_ADD),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.CreateTaskDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing task.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The task has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Task not found.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TASK_EDIT),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_2.UpdateTaskDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "update", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TASK_DELETE),
    (0, common_1.Delete)('/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a task by ID.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The task has been successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Task not found.' }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "delete", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TASK_EDIT),
    (0, common_1.Delete)('/employee/:employeeId'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('employeeId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationTeamId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "deleteEmployeeFromTasks", null);
exports.TaskController = TaskController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Tasks'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Controller)('/tasks'),
    tslib_1.__metadata("design:paramtypes", [task_service_1.TaskService, cqrs_1.CommandBus])
], TaskController);
//# sourceMappingURL=task.controller.js.map