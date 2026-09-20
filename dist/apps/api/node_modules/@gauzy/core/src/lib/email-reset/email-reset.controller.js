"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailResetController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("../shared/pipes");
const email_reset_service_1 = require("./email-reset.service");
const dto_1 = require("./dto");
let EmailResetController = class EmailResetController {
    constructor(emailResetService) {
        this.emailResetService = emailResetService;
    }
    /**
     * Create email reset request.
     *
     * @param entity
     * @param languageCode
     * @returns
     */
    async requestChangeEmail(entity, languageCode) {
        return await this.emailResetService.requestChangeEmail(entity, languageCode);
    }
    /**
     * Verify email reset request
     *
     * @param entity
     * @returns
     */
    async verifyChangeEmail(entity) {
        return await this.emailResetService.verifyCode(entity);
    }
};
exports.EmailResetController = EmailResetController;
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/request-change-email'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, decorators_1.LanguageDecorator)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ResetEmailRequestDTO, String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailResetController.prototype, "requestChangeEmail", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Post)('/verify-change-email'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.VerifyEmailResetRequestDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailResetController.prototype, "verifyChangeEmail", null);
exports.EmailResetController = EmailResetController = tslib_1.__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_EDIT, contracts_1.PermissionsEnum.PROFILE_EDIT),
    (0, common_1.Controller)('email-reset'),
    tslib_1.__metadata("design:paramtypes", [email_reset_service_1.EmailResetService])
], EmailResetController);
//# sourceMappingURL=email-reset.controller.js.map