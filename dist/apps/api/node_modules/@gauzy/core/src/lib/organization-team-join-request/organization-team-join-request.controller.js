"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamJoinRequestController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_i18n_1 = require("nestjs-i18n");
const contracts_1 = require("@gauzy/contracts");
const common_2 = require("@gauzy/common");
const crud_1 = require("../core/crud");
const pipes_1 = require("../shared/pipes");
const decorators_1 = require("../shared/decorators");
const guards_1 = require("../shared/guards");
const commands_1 = require("./commands");
const organization_team_join_request_entity_1 = require("./organization-team-join-request.entity");
const organization_team_join_request_service_1 = require("./organization-team-join-request.service");
const dto_1 = require("./dto");
let OrganizationTeamJoinRequestController = class OrganizationTeamJoinRequestController {
    constructor(_commandBus, _organizationTeamJoinRequestService) {
        this._commandBus = _commandBus;
        this._organizationTeamJoinRequestService = _organizationTeamJoinRequestService;
    }
    /**
     * Validate organization team join request
     *
     * @param params
     * @returns
     */
    async validateJoinRequest(entity) {
        return await this._organizationTeamJoinRequestService.validateJoinRequest(entity);
    }
    /**
     * Get organization team join requests
     *
     * @param params
     * @returns
     */
    async findAll(params) {
        return await this._organizationTeamJoinRequestService.findAll(params);
    }
    /**
     * Create organization team join request.
     *
     * @param entity
     * @returns
     */
    async create(entity, languageCode) {
        return await this._commandBus.execute(new commands_1.OrganizationTeamJoinRequestCreateCommand(entity, languageCode));
    }
    /**
     * Resend email verification code
     *
     * @returns
     */
    async resendConfirmationCode(entity) {
        return await this._organizationTeamJoinRequestService.resendConfirmationCode(entity);
    }
    async acceptRequestToJoin(id, action, languageCode) {
        return this._organizationTeamJoinRequestService.acceptRequestToJoin(id, action, languageCode);
    }
};
exports.OrganizationTeamJoinRequestController = OrganizationTeamJoinRequestController;
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Post)('validate')
    // Public, unauthenticated verification of a six-character confirmation code. Without an explicit
    // limit this inherited the global THROTTLE_LIMIT (60000/min), i.e. no limit at all.
    ,
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, common_2.Public)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ValidateJoinRequestDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamJoinRequestController.prototype, "validateJoinRequest", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.ORG_TEAM_JOIN_REQUEST_VIEW),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamJoinRequestController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, pipes_1.UseValidationPipe)(),
    (0, common_2.Public)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, decorators_1.LanguageDecorator)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [organization_team_join_request_entity_1.OrganizationTeamJoinRequest, String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamJoinRequestController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK)
    // Sends mail and mints a new code on every call: limited to stop both code churn and mail abuse.
    ,
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    (0, common_1.Post)('resend-code'),
    (0, pipes_1.UseValidationPipe)(),
    (0, common_2.Public)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [organization_team_join_request_entity_1.OrganizationTeamJoinRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamJoinRequestController.prototype, "resendConfirmationCode", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id/:action'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_TEAM_JOIN_REQUEST_VIEW, contracts_1.PermissionsEnum.ORG_TEAM_JOIN_REQUEST_EDIT),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('action')),
    tslib_1.__param(2, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationTeamJoinRequestController.prototype, "acceptRequestToJoin", null);
exports.OrganizationTeamJoinRequestController = OrganizationTeamJoinRequestController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OrganizationTeamJoinRequest'),
    (0, common_1.Controller)('/organization-team-join'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        organization_team_join_request_service_1.OrganizationTeamJoinRequestService])
], OrganizationTeamJoinRequestController);
//# sourceMappingURL=organization-team-join-request.controller.js.map