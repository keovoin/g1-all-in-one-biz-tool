"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_2 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const dto_1 = require("./../shared/dto");
const merchant_entity_1 = require("./merchant.entity");
const merchant_service_1 = require("./merchant.service");
const dto_2 = require("./dto");
let MerchantController = class MerchantController extends crud_1.CrudController {
    constructor(merchantService) {
        super(merchantService);
        this.merchantService = merchantService;
    }
    /**
     * GET merchant stores count
     *
     * @param options
     * @returns
     */
    async getCount(options) {
        return await this.merchantService.countBy(options);
    }
    /**
     * GET merchant stores by pagination
     *
     * @param params
     * @returns
     */
    async pagination(params) {
        return await this.merchantService.paginate(params);
    }
    /**
     * GET merchant stores
     *
     * @param params
     * @returns
     */
    async findAll(params) {
        try {
            return await this.merchantService.findAll(params);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * GET merchant by id
     *
     * @param id
     * @param query
     * @returns
     */
    async findById(id, query) {
        return await this.merchantService.findById(id, query.relations);
    }
    /**
     * CREATE new merchant store
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.merchantService.create(entity);
    }
    /**
     * UPDATE merchant store by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.merchantService.update(id, entity);
    }
};
exports.MerchantController = MerchantController;
tslib_1.__decorate([
    (0, swagger_2.ApiOperation)({ summary: 'Find all merchant stores count in the same tenant' }),
    (0, swagger_2.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found merchant stores count'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    (0, common_1.Get)('/count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MerchantController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], MerchantController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_2.ApiOperation)({
        summary: 'Find all product stores.'
    }),
    (0, swagger_2.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found product stores.',
        type: merchant_entity_1.Merchant
    }),
    (0, swagger_2.ApiResponse)({
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
], MerchantController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_2.ApiOperation)({
        summary: 'Get merchant by id.'
    }),
    (0, swagger_2.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found merchant.',
        type: merchant_entity_1.Merchant
    }),
    (0, swagger_2.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/:id'),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_VIEW),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.RelationsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], MerchantController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_2.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_2.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The merchant store has been successfully created.' /*, type: T*/
    }),
    (0, swagger_2.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.CreateMerchantDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], MerchantController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_2.ApiOperation)({ summary: 'Update merchant store record' }),
    (0, swagger_2.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The merchant store record has been successfully updated.'
    }),
    (0, swagger_2.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_2.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_2.UpdateMerchantDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], MerchantController.prototype, "update", null);
exports.MerchantController = MerchantController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Merchants'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT),
    (0, common_1.Controller)('/merchants'),
    tslib_1.__metadata("design:paramtypes", [merchant_service_1.MerchantService])
], MerchantController);
//# sourceMappingURL=merchant.controller.js.map