"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("../shared/guards");
const crud_1 = require("../core/crud");
const favorite_entity_1 = require("./favorite.entity");
const favorite_service_1 = require("./favorite.service");
const dto_1 = require("./dto");
let FavoriteController = class FavoriteController extends crud_1.CrudController {
    constructor(favoriteService) {
        super(favoriteService);
        this.favoriteService = favoriteService;
    }
    /**
     * @description Mark entity element as favorite
     * @param {IFavoriteCreateInput} entity - Data to create favorite element
     * @returns A promise that resolves to the created or found favorite element
     * @memberof FavoriteService
     */
    async create(entity) {
        return await this.favoriteService.create(entity);
    }
    /**
     * @description Find favorites by employee
     * @param {BaseQueryDTO<Favorite>} params Filter criteria to find favorites
     * @returns A promise that resolves to paginated list of favorites
     * @memberof FavoriteController
     */
    async findFavoritesByEmployee(params) {
        return await this.favoriteService.findFavoritesByEmployee(params);
    }
    /**
     * @description Get favorites elements details
     * @param params - Favorite query params
     * @returns A promise resolved at favorites elements records
     * @memberof FavoriteController
     */
    async getFavoriteDetails(params) {
        return await this.favoriteService.getFavoriteDetails(params);
    }
    /**
     * @description Delete element from favorites for current employee
     * @param {ID} id - The favorite ID to be deleted
     * @returns  A promise that resolved at the deleteResult
     * @memberof FavoriteController
     */
    async delete(id) {
        return await this.favoriteService.delete(id);
    }
};
exports.FavoriteController = FavoriteController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create element favorite' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateFavoriteDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], FavoriteController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find favorite entity records By current Employee' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found favorite records',
        type: favorite_entity_1.Favorite
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Records not found'
    }),
    (0, common_1.Get)('/employee'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], FavoriteController.prototype, "findFavoritesByEmployee", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find favorite entity records.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found favorite records',
        type: favorite_entity_1.Favorite
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Records not found'
    }),
    (0, common_1.Get)('/type'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], FavoriteController.prototype, "getFavoriteDetails", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete Favorite' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], FavoriteController.prototype, "delete", null);
exports.FavoriteController = FavoriteController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Favorites'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/favorite'),
    tslib_1.__metadata("design:paramtypes", [favorite_service_1.FavoriteService])
], FavoriteController);
//# sourceMappingURL=favorite.controller.js.map