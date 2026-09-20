"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskViewController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const pipes_1 = require("../../shared/pipes");
const guards_1 = require("../../shared/guards");
const crud_1 = require("../../core/crud");
const view_entity_1 = require("./view.entity");
const view_service_1 = require("./view.service");
const dto_1 = require("./dto");
const commands_1 = require("./commands");
let TaskViewController = class TaskViewController extends crud_1.CrudController {
    constructor(taskViewService, commandBus) {
        super(taskViewService);
        this.taskViewService = taskViewService;
        this.commandBus = commandBus;
    }
    async findAll(params) {
        return await this.taskViewService.findAll(params);
    }
    async findById(id, params) {
        return this.taskViewService.findOneByIdString(id, params);
    }
    async create(entity) {
        return await this.commandBus.execute(new commands_1.TaskViewCreateCommand(entity));
    }
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.TaskViewUpdateCommand(id, entity));
    }
    async delete(id) {
        return await this.taskViewService.delete(id);
    }
};
exports.TaskViewController = TaskViewController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all views.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found views',
        type: view_entity_1.TaskView
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskViewController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find by id' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record' /*, type: T*/
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.FindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskViewController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create view' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateViewDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskViewController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing view' }),
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
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateViewDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskViewController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete view' }),
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
], TaskViewController.prototype, "delete", null);
exports.TaskViewController = TaskViewController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Task views'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/task-views'),
    tslib_1.__metadata("design:paramtypes", [view_service_1.TaskViewService, cqrs_1.CommandBus])
], TaskViewController);
//# sourceMappingURL=view.controller.js.map