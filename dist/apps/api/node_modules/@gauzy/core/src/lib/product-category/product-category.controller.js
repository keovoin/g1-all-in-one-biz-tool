"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_i18n_1 = require("nestjs-i18n");
const contracts_1 = require("@gauzy/contracts");
const product_category_entity_1 = require("./product-category.entity");
const product_category_service_1 = require("./product-category.service");
const crud_1 = require("./../core/crud");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const dto_1 = require("./dto");
const commands_1 = require("./commands");
let ProductCategoryController = class ProductCategoryController extends crud_1.CrudController {
    constructor(productCategoryService, commandBus) {
        super(productCategoryService);
        this.productCategoryService = productCategoryService;
        this.commandBus = commandBus;
    }
    /**
     * GET inventory product categories count
     *
     * @param options
     * @returns
     */
    async getCount(options) {
        return await this.productCategoryService.countBy(options);
    }
    /**
     * GET inventory product categories by pagination
     *
     * @param options
     * @returns
     */
    async pagination(options, themeLanguage, languageCode) {
        return await this.productCategoryService.pagination(options, themeLanguage || languageCode);
    }
    /**
     * GET all product categories
     *
     * @param options
     * @param themeLanguage
     * @param languageCode
     * @returns
     */
    async findAll(options, themeLanguage, languageCode) {
        return await this.productCategoryService.findProductCategories(options, themeLanguage || languageCode);
    }
    /**
     * CREATE product category
     *
     * @param entity
     * @returns
     */
    async create(entity, themeLanguage, languageCode) {
        return await this.commandBus.execute(new commands_1.ProductCategoryCreateCommand(entity, themeLanguage || languageCode));
    }
    /**
     * UPDATE product category by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.productCategoryService.updateProductCategory(id, entity);
    }
};
exports.ProductCategoryController = ProductCategoryController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find product categories Count ' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Count product categories',
        type: product_category_entity_1.ProductCategory
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PRODUCT_CATEGORIES_VIEW),
    (0, common_1.Get)('count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductCategoryController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all product categories by pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found product categories by pagination',
        type: product_category_entity_1.ProductCategory
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PRODUCT_CATEGORIES_VIEW),
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__param(1, (0, decorators_1.LanguageDecorator)()),
    tslib_1.__param(2, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductCategoryController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all product categories.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found product categories.',
        type: product_category_entity_1.ProductCategory
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PRODUCT_CATEGORIES_VIEW),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__param(1, (0, decorators_1.LanguageDecorator)()),
    tslib_1.__param(2, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductCategoryController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.' /*, type: T*/
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, decorators_1.LanguageDecorator)()),
    tslib_1.__param(2, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ProductCategoryDTO, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductCategoryController.prototype, "create", null);
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
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.ProductCategoryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductCategoryController.prototype, "update", null);
exports.ProductCategoryController = ProductCategoryController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('ProductCategories'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PRODUCT_CATEGORIES_EDIT),
    (0, common_1.Controller)('/product-categories'),
    tslib_1.__metadata("design:paramtypes", [product_category_service_1.ProductCategoryService,
        cqrs_1.CommandBus])
], ProductCategoryController);
//# sourceMappingURL=product-category.controller.js.map