"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilitySlotsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const availability_slots_entity_1 = require("./availability-slots.entity");
const availability_slots_service_1 = require("./availability-slots.service");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const commands_1 = require("./commands");
let AvailabilitySlotsController = class AvailabilitySlotsController extends crud_1.CrudController {
    constructor(availabilitySlotsService, commandBus) {
        super(availabilitySlotsService);
        this.availabilitySlotsService = availabilitySlotsService;
        this.commandBus = commandBus;
    }
    /**
     * CREATE slots in bulk
     *
     * @param entity
     * @returns
     */
    async createBulkAvailabilitySlot(entity) {
        return await this.commandBus.execute(new commands_1.AvailabilitySlotsBulkCreateCommand(entity));
    }
    /**
     * GET all availability slots
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { relations, findInput } = data;
        return this.availabilitySlotsService.findAll({
            where: findInput,
            relations
        });
    }
    /**
     * CREATE new availability slot
     *
     * @param entity
     * @param options
     * @returns
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.AvailabilitySlotsCreateCommand(entity));
    }
    /**
     * UPDATE availability slot by id
     *
     * @param id
     * @param entity
     * @param options
     * @returns
     */
    async update(id, entity) {
        return this.availabilitySlotsService.create({ ...entity, id });
    }
};
exports.AvailabilitySlotsController = AvailabilitySlotsController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create slots in bulk' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The records have been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('/bulk'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", Promise)
], AvailabilitySlotsController.prototype, "createBulkAvailabilitySlot", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all availability slots' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found availability slots',
        type: availability_slots_entity_1.AvailabilitySlot
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AvailabilitySlotsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AvailabilitySlotsController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AvailabilitySlotsController.prototype, "update", null);
exports.AvailabilitySlotsController = AvailabilitySlotsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('AvailabilitySlots'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/availability-slots'),
    tslib_1.__metadata("design:paramtypes", [availability_slots_service_1.AvailabilitySlotsService,
        cqrs_1.CommandBus])
], AvailabilitySlotsController);
//# sourceMappingURL=availability-slots.controller.js.map