"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../core/crud");
const guards_1 = require("../shared/guards");
const decorators_1 = require("../shared/decorators");
const pipes_1 = require("../shared/pipes");
const broadcast_entity_1 = require("./broadcast.entity");
const broadcast_service_1 = require("./broadcast.service");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let BroadcastController = class BroadcastController extends crud_1.CrudController {
    constructor(broadcastService, commandBus) {
        super(broadcastService);
        this.broadcastService = broadcastService;
        this.commandBus = commandBus;
    }
    /**
     * GET all broadcasts with optional filters
     *
     * @param params - Query parameters for filtering (entity, entityId, organizationId, etc.)
     * @returns Paginated list of broadcasts
     */
    async findAll(params) {
        return await this.broadcastService.findAll(params);
    }
    /**
     * GET a broadcast by ID
     *
     * @param id - The broadcast ID
     * @returns The broadcast
     */
    async findById(id, params) {
        return await this.broadcastService.findOneById(id, params);
    }
    /**
     * CREATE a new broadcast
     *
     * @param entity - The broadcast data
     * @returns The created broadcast
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.BroadcastCreateCommand(entity));
    }
    /**
     * UPDATE a broadcast by ID
     *
     * @param id - The broadcast ID
     * @param entity - The updated broadcast data
     * @returns The updated broadcast
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.BroadcastUpdateCommand(id, entity));
    }
    /**
     * DELETE a broadcast by ID
     *
     * @param id - The broadcast ID
     * @returns Delete result
     */
    async delete(id) {
        return await this.broadcastService.delete(id);
    }
};
exports.BroadcastController = BroadcastController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all broadcasts with optional filters' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found broadcasts',
        type: broadcast_entity_1.Broadcast,
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Records not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.BROADCAST_READ),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], BroadcastController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find a broadcast by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found broadcast',
        type: broadcast_entity_1.Broadcast
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.BROADCAST_READ),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], BroadcastController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new broadcast' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Broadcast created successfully',
        type: broadcast_entity_1.Broadcast
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.BROADCAST_CREATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateBroadcastDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], BroadcastController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a broadcast' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Broadcast updated successfully',
        type: broadcast_entity_1.Broadcast
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.BROADCAST_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateBroadcastDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], BroadcastController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a broadcast' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Broadcast deleted successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.BROADCAST_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], BroadcastController.prototype, "delete", null);
exports.BroadcastController = BroadcastController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Broadcast'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/broadcasts'),
    tslib_1.__metadata("design:paramtypes", [broadcast_service_1.BroadcastService,
        cqrs_1.CommandBus])
], BroadcastController);
//# sourceMappingURL=broadcast.controller.js.map