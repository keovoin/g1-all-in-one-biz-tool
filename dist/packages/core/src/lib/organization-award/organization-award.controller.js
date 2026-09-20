"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationAwardController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const organization_award_service_1 = require("./organization-award.service");
const organization_award_entity_1 = require("./organization-award.entity");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
let OrganizationAwardController = class OrganizationAwardController extends crud_1.CrudController {
    constructor(organizationAwardService) {
        super(organizationAwardService);
        this.organizationAwardService = organizationAwardService;
    }
    /**
     * GET organization award
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { findInput } = data;
        return this.organizationAwardService.findAll({
            where: findInput
        });
    }
    /**
     * CREATE organization award
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return this.organizationAwardService.create(entity);
    }
    /**
     * UPDATE organization award by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return this.organizationAwardService.update(id, entity);
    }
    /**
     * DELETE organization award by id
     *
     * @param id
     * @returns
     */
    async delete(id) {
        return this.organizationAwardService.delete(id);
    }
};
exports.OrganizationAwardController = OrganizationAwardController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find Organization Awards.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found Organization Awards',
        type: organization_award_entity_1.OrganizationAward
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
], OrganizationAwardController.prototype, "findAll", null);
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
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationAwardController.prototype, "create", null);
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
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationAwardController.prototype, "update", null);
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
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationAwardController.prototype, "delete", null);
exports.OrganizationAwardController = OrganizationAwardController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OrganizationAward'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/organization-awards'),
    tslib_1.__metadata("design:paramtypes", [organization_award_service_1.OrganizationAwardService])
], OrganizationAwardController);
//# sourceMappingURL=organization-award.controller.js.map