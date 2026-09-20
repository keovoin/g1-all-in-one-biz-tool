"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagTypeController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../core/crud");
const guards_1 = require("../shared/guards");
const tag_type_entity_1 = require("./tag-type.entity");
const tag_type_service_1 = require("./tag-type.service");
const shared_1 = require("../shared");
const dto_1 = require("./dto");
let TagTypeController = class TagTypeController extends crud_1.CrudController {
    constructor(tagTypesService) {
        super(tagTypesService);
        this.tagTypesService = tagTypesService;
    }
    /**
     * GET tag types count
     *
     * @param data
     * @returns
     */
    async getCount(options) {
        return await this.tagTypesService.countBy(options);
    }
    /**
     * GET all tag types
     *
     * @param options
     * @returns
     */
    async findAll(options) {
        return await this.tagTypesService.findAll(options);
    }
    /**
     * Create new tag type
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return this.tagTypesService.create(entity);
    }
    /**
     * Update existing tag Type by ID
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return this.tagTypesService.update(id, entity);
    }
};
exports.TagTypeController = TagTypeController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find Tag Types Count ' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Count Tag Types',
        type: tag_type_entity_1.TagType
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, shared_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TAG_TYPES_VIEW),
    (0, common_1.Get)('/count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TagTypeController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all tag types.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found tag types.',
        type: tag_type_entity_1.TagType
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, shared_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TAG_TYPES_VIEW),
    (0, common_1.Get)('/'),
    (0, shared_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TagTypeController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, shared_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TAG_TYPES_ADD),
    (0, common_1.Post)('/'),
    (0, shared_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateTagTypeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TagTypeController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, shared_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.ORG_TAG_TYPES_EDIT),
    (0, common_1.Put)('/:id'),
    (0, shared_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', shared_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateTagTypeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TagTypeController.prototype, "update", null);
exports.TagTypeController = TagTypeController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('TagTypes'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/tag-types'),
    tslib_1.__metadata("design:paramtypes", [tag_type_service_1.TagTypeService])
], TagTypeController);
//# sourceMappingURL=tag-type.controller.js.map