"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const email_confirmation_service_1 = require("./email-confirmation.service");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("../shared/pipes");
const dto_1 = require("./dto");
let EmailVerificationController = class EmailVerificationController {
    constructor(emailConfirmationService) {
        this.emailConfirmationService = emailConfirmationService;
    }
    /**
     * Email verification by token
     *
     * @param body
     * @returns
     */
    async confirmEmail(body) {
        const user = await this.emailConfirmationService.decodeConfirmationToken(body.token);
        if (!!user) {
            return await this.emailConfirmationService.confirmEmail(user);
        }
    }
    /**
     * Email verification by token
     *
     * @param body
     * @returns
     */
    async confirmEmailByCode(body) {
        const user = await this.emailConfirmationService.confirmationByCode(body);
        if (!!user) {
            return await this.emailConfirmationService.confirmEmail(user);
        }
    }
    /**
     * Resend email verification link
     *
     * @returns
     */
    async resendConfirmationLink(config) {
        return await this.emailConfirmationService.resendConfirmationLink(config);
    }
};
exports.EmailVerificationController = EmailVerificationController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Email verification by token' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_2.Public)(),
    (0, common_1.Post)()
    // Public token verification: without an explicit limit these routes inherited the global
    // THROTTLE_LIMIT (60000/min) and were effectively not rate limited.
    ,
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ConfirmEmailByTokenDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailVerificationController.prototype, "confirmEmail", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Email verification by code' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_2.Public)(),
    (0, common_1.Post)('code'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ConfirmEmailByCodeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailVerificationController.prototype, "confirmEmailByCode", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Resend email verification link' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Post)('resend-link'),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.AppIntegrationConfigDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailVerificationController.prototype, "resendConfirmationLink", null);
exports.EmailVerificationController = EmailVerificationController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_EMAIL_VERIFICATION),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, common_1.Controller)('/auth/email/verify'),
    tslib_1.__metadata("design:paramtypes", [email_confirmation_service_1.EmailConfirmationService])
], EmailVerificationController);
//# sourceMappingURL=email-verification.controller.js.map