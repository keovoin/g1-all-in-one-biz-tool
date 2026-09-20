"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningTasksController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const decorators_1 = require("../../shared/decorators");
const guards_1 = require("../../shared/guards");
const crud_1 = require("../../core/crud");
const pipes_1 = require("../../shared/pipes");
const screening_task_entity_1 = require("./screening-task.entity");
const screening_tasks_service_1 = require("./screening-tasks.service");
const dto_1 = require("./dto");
const commands_1 = require("./commands");
let ScreeningTasksController = class ScreeningTasksController extends crud_1.CrudController {
    constructor(screeningTasksService, commandBus) {
        super(screeningTasksService);
        this.screeningTasksService = screeningTasksService;
        this.commandBus = commandBus;
    }
    /**
     * Find all screening tasks with pagination.
     *
     * @param params - Pagination parameters and optional filters.
     * @returns A paginated response containing screening tasks.
     */
    async findAll(params) {
        return await this.screeningTasksService.findAll(params);
    }
    /**
     * Find a screening task by its unique identifier.
     *
     * @param id - The UUID of the screening task.
     * @param params - Optional query parameters for additional filtering.
     * @returns The screening task that matches the given ID.
     */
    async findById(id, params) {
        return this.screeningTasksService.findOneByIdString(id, params);
    }
    /**
     * Creates a new screening task.
     *
     * @param entity - The DTO containing data required to create a new screening task.
     * @returns A promise that resolves to the newly created screening task.
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.ScreeningTaskCreateCommand(entity));
    }
    /**
     * Updates an existing screening task.
     *
     * @param id - The UUID of the screening task to update.
     * @param entity - The DTO containing updated screening task data.
     * @returns A promise that resolves to the updated screening task.
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.ScreeningTaskUpdateCommand(id, entity));
    }
    /**
     * Delete a screening task by its unique identifier.
     *
     * @param id - The UUID of the screening task to delete.
     * @returns A DeleteResult indicating the outcome of the deletion.
     */
    async delete(id) {
        return await this.screeningTasksService.delete(id);
    }
};
exports.ScreeningTasksController = ScreeningTasksController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all screening tasks' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found screening tasks.',
        type: screening_task_entity_1.ScreeningTask
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ScreeningTasksController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find screening task by id' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one screening task',
        type: screening_task_entity_1.ScreeningTask
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Screening task not found'
    }),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.FindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ScreeningTasksController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Creates Screening Task' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateScreeningTaskDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ScreeningTasksController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Updates an existing screening task' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateScreeningTaskDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ScreeningTasksController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete screening task' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ScreeningTasksController.prototype, "delete", null);
exports.ScreeningTasksController = ScreeningTasksController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Screening Tasks'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(),
    (0, common_1.Controller)('/screening-tasks'),
    tslib_1.__metadata("design:paramtypes", [screening_tasks_service_1.ScreeningTasksService,
        cqrs_1.CommandBus])
], ScreeningTasksController);
//# sourceMappingURL=screening-tasks.controller.js.map