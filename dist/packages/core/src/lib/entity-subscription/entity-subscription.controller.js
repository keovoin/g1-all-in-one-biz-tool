"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitySubscriptionController = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("../shared/guards");
const crud_1 = require("./../core/crud");
const entity_subscription_entity_1 = require("./entity-subscription.entity");
const entity_subscription_service_1 = require("./entity-subscription.service");
const entity_subscription_create_command_1 = require("./commands/entity-subscription.create.command");
const dto_1 = require("./dto");
let EntitySubscriptionController = class EntitySubscriptionController extends crud_1.CrudController {
    constructor(_entitySubscriptionService, _commandBus) {
        super(_entitySubscriptionService);
        this._entitySubscriptionService = _entitySubscriptionService;
        this._commandBus = _commandBus;
    }
    /**
     * Retrieve all subscriptions with optional filtering and pagination.
     *
     * Fetches a paginated list of subscriptions, applying any filtering options provided via query parameters.
     *
     * @param params - The pagination and filtering parameters for querying subscriptions.
     * @returns A promise that resolves to a paginated list of subscriptions.
     */
    async findAll(params) {
        return this._entitySubscriptionService.findAll(params);
    }
    /**
     * Find subscription by ID.
     *
     * Retrieves a subscription record using its unique identifier. Optional query parameters can be used
     * to filter or modify the data retrieval.
     *
     * @param id - The unique identifier (UUID) of the subscription.
     * @param params - Optional query parameters for additional filtering.
     * @returns A promise that resolves to the found subscription entity.
     */
    async findById(id, params) {
        return this._entitySubscriptionService.findOneByIdString(id, params);
    }
    /**
     * Subscribe to an entity.
     *
     * Creates a new subscription for an entity using the provided subscription details.
     *
     * @param entity - The subscription details required to create a new subscription.
     * @returns The newly created entity subscription.
     */
    create(entity) {
        return this._commandBus.execute(new entity_subscription_create_command_1.EntitySubscriptionCreateCommand(entity));
    }
    /**
     * Unsubscribe from an entity.
     *
     * Removes a subscription based on the provided subscription ID along with any additional query filters.
     *
     * @param id - The UUID of the subscription to be deleted.
     * @param options - Optional query parameters to help locate the subscription.
     * @returns A promise that resolves with the delete result.
     */
    async delete(id, params) {
        return this._entitySubscriptionService.unsubscribe(id, params);
    }
};
exports.EntitySubscriptionController = EntitySubscriptionController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve subscriptions with filtering and pagination',
        description: 'Fetches all subscriptions with optional filtering by type, supporting pagination parameters.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'params',
        description: 'Pagination and filter parameters for subscriptions',
        type: crud_1.BaseQueryDTO // Ensure BaseQueryDTO is decorated for Swagger if needed
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found subscriptions',
        type: entity_subscription_entity_1.EntitySubscription
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No subscriptions found'
    }),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EntitySubscriptionController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find subscription by ID',
        description: 'Retrieves a subscription record using its unique identifier. Optional query parameters allow further filtering of the data.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'The unique UUID of the subscription',
        type: String
    }),
    (0, swagger_1.ApiQuery)({
        name: 'params',
        description: 'Optional query parameters for filtering the subscription data',
        type: crud_1.FindOptionsQueryDTO // Ensure FindOptionsQueryDTO is properly defined elsewhere
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record',
        type: entity_subscription_entity_1.EntitySubscription
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, pipes_1.UseValidationPipe)(),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.FindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EntitySubscriptionController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Subscribe to an entity',
        description: 'Creates a new subscription for an entity using the provided subscription details.'
    }),
    (0, swagger_1.ApiBody)({
        description: 'The subscription details for creating a new entity subscription.',
        type: dto_1.CreateEntitySubscriptionDTO
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.',
        type: entity_subscription_entity_1.EntitySubscription
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateEntitySubscriptionDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EntitySubscriptionController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Unsubscribe from an entity',
        description: 'Removes a subscription based on its UUID and optional query filters.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'The unique UUID of the subscription to be deleted.',
        type: String
    }),
    (0, swagger_1.ApiQuery)({
        name: 'options',
        description: 'Optional filters to locate the subscription for unsubscribe.',
        type: dto_1.EntitySubscriptionFindInputDTO
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'Unsubscribe request accepted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Subscription not found.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.EntitySubscriptionFindInputDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EntitySubscriptionController.prototype, "delete", null);
exports.EntitySubscriptionController = EntitySubscriptionController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EntitySubscriptions'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/entity-subscription'),
    tslib_1.__metadata("design:paramtypes", [entity_subscription_service_1.EntitySubscriptionService,
        cqrs_1.CommandBus])
], EntitySubscriptionController);
//# sourceMappingURL=entity-subscription.controller.js.map