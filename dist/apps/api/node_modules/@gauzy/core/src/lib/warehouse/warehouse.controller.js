"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const decorators_1 = require("./../shared/decorators");
const dto_1 = require("./../shared/dto");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const warehouse_service_1 = require("./warehouse.service");
const warehouse_entity_1 = require("./warehouse.entity");
const warehouse_product_service_1 = require("./warehouse-product-service");
const dto_2 = require("./dto");
let WarehouseController = class WarehouseController extends crud_1.CrudController {
    constructor(warehouseService, warehouseProductsService) {
        super(warehouseService);
        this.warehouseService = warehouseService;
        this.warehouseProductsService = warehouseProductsService;
    }
    /**
     * GET all warehouse products
     *
     * @param warehouseId
     * @returns
     */
    async findAllWarehouseProducts(warehouseId) {
        return await this.warehouseProductsService.getAllWarehouseProducts(warehouseId);
    }
    /**
     * CREATE warehouse products
     *
     * @param entity
     * @param warehouseId
     * @returns
     */
    async addWarehouseProducts(warehouseId, entity) {
        return await this.warehouseProductsService.createWarehouseProductBulk(entity, warehouseId);
    }
    /**
     * UPDATE warehouse product quantity
     *
     * @param warehouseProductId
     * @param value
     * @returns
     */
    async updateWarehouseProductQuantity(warehouseProductId, value) {
        return await this.warehouseProductsService.updateWarehouseProductQuantity(warehouseProductId, value.count);
    }
    /**
     * UPDATE warehouse product variant quantity
     *
     * @param warehouseProductVariantId
     * @param value
     * @returns
     */
    async updateWarehouseProductVariantQuantity(warehouseProductVariantId, value) {
        return await this.warehouseProductsService.updateWarehouseProductVariantQuantity(warehouseProductVariantId, value.count);
    }
    /**
     * GET warehouse count
     *
     * @param options
     * @returns
     */
    async getCount(options) {
        return await this.warehouseService.countBy(options);
    }
    /**
     * GET warehouses by pagination
     *
     * @param params
     * @returns
     */
    async pagination(params) {
        return await this.warehouseService.paginate(params);
    }
    /**
     * GET warehouses
     *
     * @param params
     * @returns
     */
    async findAll(params) {
        return await this.warehouseService.findAll(params);
    }
    /**
     * GET warehouse with relations by id
     *
     * @param id
     * @returns
     */
    async findById(id, query) {
        return await this.warehouseService.findById(id, query.relations);
    }
    /**
     * CREATE new warehouse store
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.warehouseService.create(entity);
    }
    /**
     * UPDATE warehouse by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.warehouseService.create({
            ...entity,
            id
        });
    }
};
exports.WarehouseController = WarehouseController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all warehouse products.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found warehouse products.',
        type: warehouse_entity_1.Warehouse
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    (0, common_1.Get)('/inventory/:warehouseId'),
    tslib_1.__param(0, (0, common_1.Param)('warehouseId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], WarehouseController.prototype, "findAllWarehouseProducts", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create warehouse products' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.' /*, type: T*/
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)('/inventory/:warehouseId'),
    tslib_1.__param(0, (0, common_1.Param)('warehouseId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], WarehouseController.prototype, "addWarehouseProducts", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update warehouse product quantity.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Warehouse product quantity updated.',
        type: warehouse_entity_1.Warehouse
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Post)('/inventory-quantity/:warehouseProductId'),
    tslib_1.__param(0, (0, common_1.Param)('warehouseProductId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WarehouseController.prototype, "updateWarehouseProductQuantity", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update warehouse product variant count.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Warehouse product variant count updated.',
        type: warehouse_entity_1.Warehouse
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Post)('/inventory-quantity/variants/:warehouseProductVariantId'),
    tslib_1.__param(0, (0, common_1.Param)('warehouseProductVariantId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WarehouseController.prototype, "updateWarehouseProductVariantQuantity", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all warehouse count in the same tenant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found warehouse count'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    (0, common_1.Get)('/count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WarehouseController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], WarehouseController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all warehouses.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found warehouses.',
        type: warehouse_entity_1.Warehouse
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], WarehouseController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)('/:id'),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.RelationsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], WarehouseController.prototype, "findById", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.CreateWarehouseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], WarehouseController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing warehouse' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The warehouse record has been successfully edited.'
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
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_2.UpdateWarehouseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], WarehouseController.prototype, "update", null);
exports.WarehouseController = WarehouseController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Warehouses'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT),
    (0, common_1.Controller)('/warehouses'),
    tslib_1.__metadata("design:paramtypes", [warehouse_service_1.WarehouseService,
        warehouse_product_service_1.WarehouseProductService])
], WarehouseController);
//# sourceMappingURL=warehouse.controller.js.map