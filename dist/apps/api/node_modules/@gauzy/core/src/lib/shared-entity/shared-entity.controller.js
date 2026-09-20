"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedEntityController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const common_2 = require("@gauzy/common");
const pipes_1 = require("../shared/pipes");
const guards_1 = require("../shared/guards");
const crud_1 = require("../core/crud");
const shared_entity_entity_1 = require("./shared-entity.entity");
const shared_entity_service_1 = require("./shared-entity.service");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let SharedEntityController = class SharedEntityController extends crud_1.CrudController {
    constructor(sharedEntityService, commandBus) {
        super(sharedEntityService);
        this.sharedEntityService = sharedEntityService;
        this.commandBus = commandBus;
    }
    async findAll(params) {
        return await this.sharedEntityService.findAll(params);
    }
    async getSharedEntityByToken(token) {
        return await this.sharedEntityService.getSharedEntityByToken(token);
    }
    async create(entity) {
        return await this.commandBus.execute(new commands_1.SharedEntityCreateCommand(entity));
    }
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.SharedEntityUpdateCommand(id, entity));
    }
    async delete(id) {
        return await this.sharedEntityService.delete(id);
    }
};
exports.SharedEntityController = SharedEntityController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all shared entities'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found shared entities',
        type: shared_entity_entity_1.SharedEntity
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
], SharedEntityController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get a shared entity by token'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found shared entity',
        type: shared_entity_entity_1.SharedEntity
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_2.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('/token/:token'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SharedEntityController.prototype, "getSharedEntityByToken", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new shared entity'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Shared entity created successfully',
        type: shared_entity_entity_1.SharedEntity
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateSharedEntityDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], SharedEntityController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update a shared entity'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Shared entity updated successfully',
        type: shared_entity_entity_1.SharedEntity
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateSharedEntityDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], SharedEntityController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a shared entity'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Shared entity deleted successfully'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SharedEntityController.prototype, "delete", null);
exports.SharedEntityController = SharedEntityController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('SharedEntity'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/shared-entities'),
    tslib_1.__metadata("design:paramtypes", [shared_entity_service_1.SharedEntityService,
        cqrs_1.CommandBus])
], SharedEntityController);
//# sourceMappingURL=shared-entity.controller.js.map