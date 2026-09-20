"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicOrganizationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const pipes_1 = require("../../shared/pipes");
const dto_1 = require("./../../core/dto");
const public_transform_interceptor_1 = require("./../public-transform.interceptor");
const public_organization_query_dto_1 = require("./dto/public-organization-query.dto");
const public_organization_service_1 = require("./public-organization.service");
const queries_1 = require("./queries");
let PublicOrganizationController = class PublicOrganizationController {
    constructor(queryBus, publicOrganizationService) {
        this.queryBus = queryBus;
        this.publicOrganizationService = publicOrganizationService;
    }
    /**
     * GET public clients in the specific organization
     *
     * @param options
     * @returns
     */
    async findPublicClientsByOrganization(options) {
        return await this.queryBus.execute(new queries_1.FindPublicClientsByOrganizationQuery(options));
    }
    /**
     * GET public clients counts in the specific organization
     *
     * @param options
     * @returns
     */
    async findPublicClientCountsByOrganization(options) {
        return await this.publicOrganizationService.findPublicClientCountsByOrganization(options);
    }
    /**
     * GET public clients counts in the specific organization
     *
     * @param options
     * @returns
     */
    async findPublicProjectCountsByOrganization(options) {
        return await this.publicOrganizationService.findPublicProjectCountsByOrganization(options);
    }
    /**
     * GET organization by profile link
     *
     * @param profile_link
     * @returns
     */
    async findOneByProfileLink(params, options) {
        return await this.queryBus.execute(new queries_1.FindPublicOrganizationQuery(params, options.relations));
    }
};
exports.PublicOrganizationController = PublicOrganizationController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find public information for all clients in the organization.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found clients in the organization'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Records not found'
    }),
    (0, common_1.Get)('client'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.TenantOrganizationBaseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicOrganizationController.prototype, "findPublicClientsByOrganization", null);
tslib_1.__decorate([
    (0, common_1.Get)('client/count'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.TenantOrganizationBaseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicOrganizationController.prototype, "findPublicClientCountsByOrganization", null);
tslib_1.__decorate([
    (0, common_1.Get)('project/count'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.TenantOrganizationBaseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicOrganizationController.prototype, "findPublicProjectCountsByOrganization", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find Organization by profile link.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(':profile_link/:id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, public_organization_query_dto_1.PublicOrganizationQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicOrganizationController.prototype, "findOneByProfileLink", null);
exports.PublicOrganizationController = PublicOrganizationController = tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.UseInterceptors)(public_transform_interceptor_1.PublicTransformInterceptor),
    (0, common_1.Controller)('/public/organization'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus,
        public_organization_service_1.PublicOrganizationService])
], PublicOrganizationController);
//# sourceMappingURL=public-organization.controller.js.map