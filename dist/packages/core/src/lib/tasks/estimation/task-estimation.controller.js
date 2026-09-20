"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEstimationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const guards_1 = require("./../../shared/guards");
const task_estimation_service_1 = require("./task-estimation.service");
const decorators_1 = require("./../../shared/decorators");
const crud_1 = require("./../../core/crud");
const dto_1 = require("./dto");
const commands_1 = require("./commands");
const pipes_1 = require("./../../shared/pipes");
let TaskEstimationController = class TaskEstimationController extends crud_1.CrudController {
    constructor(taskEstimationService, commandBus) {
        super(taskEstimationService);
        this.taskEstimationService = taskEstimationService;
        this.commandBus = commandBus;
    }
    /**
     * Create new Linked Issue
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.TaskEstimationCreateCommand(entity));
    }
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.TaskEstimationUpdateCommand(id, entity));
    }
    async delete(id) {
        return await this.commandBus.execute(new commands_1.TaskEstimationDeleteCommand(id));
    }
};
exports.TaskEstimationController = TaskEstimationController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'create a task estimation' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TASK_ADD),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateTaskEstimationDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskEstimationController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing task estimation' }),
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
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TASK_EDIT),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.UpdateTaskEstimationDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskEstimationController.prototype, "update", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TASK_DELETE),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskEstimationController.prototype, "delete", null);
exports.TaskEstimationController = TaskEstimationController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Task Estimation'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Controller)('/task-estimation'),
    tslib_1.__metadata("design:paramtypes", [task_estimation_service_1.TaskEstimationService,
        cqrs_1.CommandBus])
], TaskEstimationController);
//# sourceMappingURL=task-estimation.controller.js.map