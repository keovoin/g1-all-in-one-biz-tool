"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const deal_entity_1 = require("./deal.entity");
const deal_service_1 = require("./deal.service");
const crud_1 = require("../core/crud");
const decorators_1 = require("../shared/decorators");
const guards_1 = require("../shared/guards");
const pipes_1 = require("../shared/pipes");
const dto_1 = require("./dto");
let DealController = class DealController extends crud_1.CrudController {
    constructor(_dealService) {
        super(_dealService);
        this._dealService = _dealService;
    }
    /**
     * Retrieve all deals with optional filtering and pagination.
     *
     * @param params - Pagination and filtering parameters
     * @returns A paginated result of deals
     */
    async findAll(params) {
        return await this._dealService.findAll(params);
    }
    /**
     * Find a deal by ID.
     *
     * Retrieves a deal by its unique identifier.
     *
     * @param id - The ID of the deal to retrieve.
     * @param query - Query parameters for relations.
     * @returns A promise resolving to the found deal entity.
     */
    async findById(id, options) {
        return await this._dealService.findOneByIdString(id, options);
    }
    /**
     * Creates a new deal entity.
     *
     * This method handles the creation of a new deal entity by calling the create method
     * on the dealService with the provided entity data.
     *
     * @param entity - The partial deal entity data to create.
     * @returns A promise that resolves to the created deal entity.
     */
    async create(entity) {
        // Call the create method on the dealService with the provided entity data
        return await this._dealService.create(entity);
    }
};
exports.DealController = DealController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all deals with optional filtering and pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved deals.'
    }),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DealController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find a deal by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The found deal' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Deal not found' }),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.FindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DealController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new deal' }),
    (0, swagger_1.ApiCreatedResponse)({ type: deal_entity_1.Deal, description: 'The deal has been successfully created.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid request data.' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EDIT_SALES_PIPELINES),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateDealDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DealController.prototype, "create", null);
exports.DealController = DealController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Deal'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.VIEW_SALES_PIPELINES),
    (0, common_1.Controller)('/deals'),
    tslib_1.__metadata("design:paramtypes", [deal_service_1.DealService])
], DealController);
//# sourceMappingURL=deal.controller.js.map