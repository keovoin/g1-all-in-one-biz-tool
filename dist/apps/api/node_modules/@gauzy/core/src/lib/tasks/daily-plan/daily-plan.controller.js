"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyPlanController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../../core/crud");
const pipes_1 = require("../../shared/pipes");
const dto_1 = require("./dto");
const guards_1 = require("../../shared/guards");
const decorators_1 = require("../../shared/decorators");
const daily_plan_entity_1 = require("./daily-plan.entity");
const daily_plan_service_1 = require("./daily-plan.service");
let DailyPlanController = class DailyPlanController extends crud_1.CrudController {
    constructor(dailyPlanService) {
        super(dailyPlanService);
        this.dailyPlanService = dailyPlanService;
    }
    /**
     * Retrieves the daily plans for the currently authenticated user.
     *
     * This endpoint allows users to fetch their own daily plans with support for pagination.
     *
     * @param params - Pagination and filtering parameters for retrieving daily plans.
     * @returns A paginated list of daily plans for the authenticated user.
     */
    async getMyPlans(params) {
        return await this.dailyPlanService.getMyPlans(params);
    }
    /**
     * Retrieves daily plans for the team members based on the provided query parameters.
     *
     * Accessible by users with appropriate permissions. Supports pagination and filtering.
     *
     * @param params - Pagination and filtering parameters for fetching team daily plans.
     * @returns A paginated list of team daily plans.
     */
    async getTeamDailyPlans(params) {
        return await this.dailyPlanService.getTeamDailyPlans(params);
    }
    /**
     * Retrieves daily plans for a specific employee.
     *
     * Requires appropriate permissions. Supports pagination.
     *
     * @param employeeId - The ID of the employee whose daily plans are to be fetched.
     * @param params - Pagination and filtering parameters.
     * @returns A paginated list of daily plans for the specified employee.
     */
    async getEmployeeDailyPlans(employeeId, params) {
        return await this.dailyPlanService.getDailyPlansByEmployee(params, employeeId);
    }
    /**
     * Retrieves daily plans associated with a specific task.
     *
     * Requires appropriate permissions. Supports pagination and filtering.
     *
     * @param taskId - The ID of the task whose related daily plans are to be retrieved.
     * @param params - Pagination and filtering parameters.
     * @returns A paginated list of daily plans linked to the given task.
     */
    async getDailyPlansForTaskId(taskId, params) {
        return await this.dailyPlanService.getDailyPlansByTask(params, taskId);
    }
    /**
     * Add a task to a specified daily plan.
     *
     * Requires appropriate permissions to edit or create a daily plan.
     *
     * @param planId - The unique identifier of the daily plan to which the task will be added.
     * @param input - The task input including taskId, employeeId, and organizationId.
     * @returns The updated daily plan with the newly added task.
     */
    async addTaskToDailyPlan(planId, input) {
        return await this.dailyPlanService.addTaskToPlan(planId, input);
    }
    /**
     * Remove a task from a specified daily plan.
     *
     * Requires appropriate permissions to modify the daily plan.
     *
     * @param planId - The ID of the daily plan from which the task will be removed.
     * @param input - Object containing taskId and other related identifiers to perform the removal.
     * @returns The updated daily plan after removing the task.
     */
    async removeTaskFromDailyPlan(planId, input) {
        return await this.dailyPlanService.removeTaskFromPlan(planId, input);
    }
    /**
     * Delete a task from multiple daily plans.
     *
     * Requires appropriate data such as employee ID and organization ID to identify which plans to update.
     *
     * @param taskId - The unique identifier of the task to be removed from daily plans.
     * @param input - An object containing details (e.g. employeeId, organizationId) to locate affected plans.
     * @returns An array of updated daily plans after the task has been removed.
     */
    async removeTaskFromManyPlans(taskId, input) {
        return this.dailyPlanService.removeTaskFromManyPlans(taskId, input);
    }
    /**
     * Retrieves all daily plans based on the provided query parameters.
     *
     * Requires appropriate permissions to view organization data.
     * Supports pagination and filtering.
     *
     * @param params - Query parameters for pagination and optional filtering.
     * @returns A paginated list of all daily plans.
     */
    async get(params) {
        return await this.dailyPlanService.getAllPlans(params);
    }
    /**
     * Creates a new daily plan.
     *
     * Requires appropriate permissions to create a daily plan.
     * Validates and transforms input data using a validation pipe.
     *
     * @param entity - The data required to create a daily plan.
     * @returns The newly created daily plan.
     */
    async create(entity) {
        return await this.dailyPlanService.createDailyPlan(entity);
    }
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
    async update(id, entity) {
        return await this.dailyPlanService.updateDailyPlan(id, entity);
    }
    /**
     * Deletes a daily plan by its ID.
     *
     * Requires appropriate permissions to perform the deletion.
     *
     * @param planId - The ID of the daily plan to be deleted.
     * @returns A result object indicating the outcome of the delete operation.
     */
    async delete(planId) {
        return await this.dailyPlanService.delete(planId);
    }
};
exports.DailyPlanController = DailyPlanController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find my daily plans.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found plans',
        type: daily_plan_entity_1.DailyPlan
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No Record found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.DAILY_PLAN_READ),
    (0, common_1.Get)('/me'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyPlanController.prototype, "getMyPlans", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find team daily plans.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found plans',
        type: daily_plan_entity_1.DailyPlan
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No Record found'
    }),
    (0, common_1.Get)('/team'),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.DAILY_PLAN_READ),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyPlanController.prototype, "getTeamDailyPlans", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find employee daily plans.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found plans',
        type: daily_plan_entity_1.DailyPlan
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No Record found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.DAILY_PLAN_READ),
    (0, common_1.Get)('/employee/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyPlanController.prototype, "getEmployeeDailyPlans", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find task daily plans.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found plans',
        type: daily_plan_entity_1.DailyPlan
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No Record found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.DAILY_PLAN_READ),
    (0, common_1.Get)('/task/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyPlanController.prototype, "getDailyPlansForTaskId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Add a task to daily plan'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Task added successfully.',
        type: daily_plan_entity_1.DailyPlan
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No record found with the given ID.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.DAILY_PLAN_CREATE, contracts_1.PermissionsEnum.DAILY_PLAN_UPDATE),
    (0, common_1.Post)('/:id/task'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyPlanController.prototype, "addTaskToDailyPlan", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Remove a task from daily plan'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Task successfully removed from the daily plan.',
        type: daily_plan_entity_1.DailyPlan
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No record found with the given ID.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.DAILY_PLAN_CREATE, contracts_1.PermissionsEnum.DAILY_PLAN_UPDATE),
    (0, common_1.Put)('/:id/task'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyPlanController.prototype, "removeTaskFromDailyPlan", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Remove a task from daily plans'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Task successfully removed from the daily plans.',
        type: daily_plan_entity_1.DailyPlan
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No record found with the given ID.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.DAILY_PLAN_CREATE, contracts_1.PermissionsEnum.DAILY_PLAN_UPDATE),
    (0, common_1.Put)('/:taskId/remove'),
    tslib_1.__param(0, (0, common_1.Param)('taskId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.RemoveTaskFromManyPlansDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyPlanController.prototype, "removeTaskFromManyPlans", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find daily plans.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found plans',
        type: daily_plan_entity_1.DailyPlan
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No Record found'
    }),
    (0, common_1.Get)('/'),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.DAILY_PLAN_READ),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyPlanController.prototype, "get", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new Daily Plan' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Daily Plan has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The request body must contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.DAILY_PLAN_CREATE),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateDailyPlanDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyPlanController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update daily plan'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plan updated',
        type: daily_plan_entity_1.DailyPlan
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No Record found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.DAILY_PLAN_UPDATE),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateDailyPlanDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyPlanController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete Daily plan'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plan deleted',
        type: daily_plan_entity_1.DailyPlan
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No Record found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.DAILY_PLAN_DELETE),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DailyPlanController.prototype, "delete", null);
exports.DailyPlanController = DailyPlanController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Daily Plan'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.DAILY_PLAN_UPDATE),
    (0, common_1.Controller)('/daily-plan'),
    tslib_1.__metadata("design:paramtypes", [daily_plan_service_1.DailyPlanService])
], DailyPlanController);
//# sourceMappingURL=daily-plan.controller.js.map