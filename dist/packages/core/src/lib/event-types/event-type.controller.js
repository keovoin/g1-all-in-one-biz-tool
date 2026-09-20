"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const commands_1 = require("./commands");
const event_type_entity_1 = require("./event-type.entity");
const event_type_service_1 = require("./event-type.service");
let EventTypeController = class EventTypeController extends crud_1.CrudController {
    constructor(eventTypeService, commandBus) {
        super(eventTypeService);
        this.eventTypeService = eventTypeService;
        this.commandBus = commandBus;
    }
    /**
     * GET event types counts
     *
     * @param filter
     * @returns
     */
    async getCount(options) {
        return this.eventTypeService.countBy(options);
    }
    /**
     * GET event types pagination
     *
     * @param filter
     * @returns
     */
    async pagination(filter) {
        return this.eventTypeService.paginate(filter);
    }
    /**
     * GET all event types
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { relations, findInput } = data;
        return this.eventTypeService.findAll({
            where: findInput,
            relations
        });
    }
    /**
     * GET event type by id
     *
     * @param id
     * @param data
     * @returns
     */
    async findById(id, data) {
        const { relations = [] } = data;
        return this.eventTypeService.findOneByIdString(id, {
            relations
        });
    }
    /**
     * CREATE new event type
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.EventTypeCreateCommand(entity));
    }
    /**
     * UPDATE event type by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return this.eventTypeService.create({ ...entity, id });
    }
};
exports.EventTypeController = EventTypeController;
tslib_1.__decorate([
    (0, common_1.Get)('count'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EventTypeController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EventTypeController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all event types' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found expense',
        type: event_type_entity_1.EventType
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
], EventTypeController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find event type by id.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Find Event type',
        type: event_type_entity_1.EventType
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EventTypeController.prototype, "findById", null);
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
], EventTypeController.prototype, "create", null);
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
    tslib_1.__metadata("design:paramtypes", [String, event_type_entity_1.EventType]),
    tslib_1.__metadata("design:returntype", Promise)
], EventTypeController.prototype, "update", null);
exports.EventTypeController = EventTypeController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EventType'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/event-type'),
    tslib_1.__metadata("design:paramtypes", [event_type_service_1.EventTypeService, cqrs_1.CommandBus])
], EventTypeController);
//# sourceMappingURL=event-type.controller.js.map