"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const context_1 = require("./../core/context");
const product_service_1 = require("./product.service");
const product_entity_1 = require("./product.entity");
const commands_1 = require("./commands");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
let ProductController = class ProductController extends crud_1.CrudController {
    constructor(productService, commandBus) {
        super(productService);
        this.productService = productService;
        this.commandBus = commandBus;
    }
    /**
     * GET all products translated
     *
     * @param langCode
     * @param data
     * @param page
     * @param limit
     * @returns
     */
    async findAllProductsTranslated(langCode, data, page, limit) {
        const { relations = [], findInput = null } = data;
        return this.productService.findAllProducts(langCode, relations, findInput, { page, limit });
    }
    /**
     * GET product by language & id
     *
     * @param id
     * @param langCode
     * @param data
     * @returns
     */
    async findOneProductTranslated(id, langCode, data) {
        const { relations = [] } = data;
        return this.productService.findByIdTranslated(langCode, id, relations);
    }
    /**
     * Create product image gallery
     *
     * @param productId
     * @param images
     * @returns
     */
    async addGalleryImage(productId, images) {
        return this.productService.addGalleryImages(productId, images);
    }
    /**
     * UPDATE product set image as a feature
     *
     * @param productId
     * @param image
     * @returns
     */
    async setAsFeatured(productId, image) {
        return this.productService.setAsFeatured(productId, image);
    }
    /**
     * DELETE product gallery image by id
     *
     * @param productId
     * @param imageId
     * @returns
     */
    async deleteGalleryImage(productId, imageId) {
        return this.productService.deleteGalleryImage(productId, imageId);
    }
    /**
     * DELETE product feature image by product id
     *
     * @param productId
     * @returns
     */
    async deleteFeaturedImage(productId) {
        return this.productService.deleteFeaturedImage(productId);
    }
    /**
     * GET inventory products count
     *
     * @param data
     * @returns
     */
    async getCount(data) {
        const { findInput = null } = data;
        return await this.productService.count({
            where: {
                tenantId: context_1.RequestContext.currentTenantId(),
                ...findInput
            }
        });
    }
    /**
     * GET inventory products by pagination
     *
     * @param filter
     * @returns
     */
    async pagination(filter, themeLanguage) {
        return this.productService.pagination(filter, themeLanguage);
    }
    /**
     * GET all inventory products in the same tenant
     *
     * @param data
     * @param themeLanguage
     * @returns
     */
    async findAll(data, themeLanguage) {
        return await this.productService.findProducts(data, themeLanguage);
    }
    /**
     * GET product by id
     *
     * @param id
     * @param data
     * @returns
     */
    async findById(id, data) {
        const { relations = [], findInput = null } = data;
        return this.productService.findOneByIdString(id, {
            relations,
            where: findInput
        });
    }
    /**
     * CREATE new product
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.ProductCreateCommand(entity));
    }
    /**
     * UPDATE existing product by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.ProductUpdateCommand(id, entity));
    }
    /**
     * DELETE product by id
     *
     * @param id
     * @returns
     */
    async delete(id) {
        return await this.commandBus.execute(new commands_1.ProductDeleteCommand(id));
    }
};
exports.ProductController = ProductController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all products translated'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found products',
        type: product_entity_1.Product
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    (0, common_1.Get)('local/:langCode'),
    tslib_1.__param(0, (0, common_1.Param)('langCode')),
    tslib_1.__param(1, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__param(2, (0, common_1.Query)('page')),
    tslib_1.__param(3, (0, common_1.Query)('_limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "findAllProductsTranslated", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find one product translated'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found product',
        type: product_entity_1.Product
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    (0, common_1.Get)('local/:langCode/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('langCode')),
    tslib_1.__param(2, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "findOneProductTranslated", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create gallery image' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The gallery image has been stored.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT),
    (0, common_1.Post)('add-images/:productId'),
    tslib_1.__param(0, (0, common_1.Param)('productId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "addGalleryImage", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Set featured image' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The featured image has been saved.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT),
    (0, common_1.Post)('set-as-featured/:productId'),
    tslib_1.__param(0, (0, common_1.Param)('productId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "setAsFeatured", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete image from gallery' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT),
    (0, common_1.Delete)(':productId/gallery-image/:imageId'),
    tslib_1.__param(0, (0, common_1.Param)('productId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('imageId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "deleteGalleryImage", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete featured image' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT),
    (0, common_1.Delete)('featured-image/:productId'),
    tslib_1.__param(0, (0, common_1.Param)('productId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "deleteFeaturedImage", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find Products Count ' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Count Products',
        type: product_entity_1.Product
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    (0, common_1.Get)('count'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__param(1, (0, decorators_1.LanguageDecorator)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all products' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found products',
        type: product_entity_1.Product
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__param(1, (0, decorators_1.LanguageDecorator)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find Product by id ' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record',
        type: product_entity_1.Product
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "findById", null);
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
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateProductDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing record' }),
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
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateProductDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductController.prototype, "delete", null);
exports.ProductController = ProductController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Product'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/products'),
    tslib_1.__metadata("design:paramtypes", [product_service_1.ProductService, cqrs_1.CommandBus])
], ProductController);
//# sourceMappingURL=product.controller.js.map