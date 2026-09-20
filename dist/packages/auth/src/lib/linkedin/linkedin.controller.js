"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedinController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const social_auth_service_1 = require("./../social-auth.service");
const request_context_decorator_1 = require("./../request-context.decorator");
let LinkedinController = class LinkedinController {
    constructor(service) {
        this.service = service;
    }
    /**
     * Initiates LinkedIn login.
     *
     * @param req
     */
    linkedinLogin(_) { }
    /**
     * LinkedIn login callback endpoint.
     *
     * @param requestCtx - The context of the incoming request.
     * @param res - The response object.
     * @returns The result of the LinkedIn login callback.
     */
    async linkedinLoginCallback(context, res) {
        const { user } = context;
        const { success, authData } = await this.service.validateOAuthLoginEmail(user.emails);
        return this.service.routeRedirect(success, authData, res);
    }
};
exports.LinkedinController = LinkedinController;
tslib_1.__decorate([
    (0, common_1.Get)('/linkedin'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], LinkedinController.prototype, "linkedinLogin", null);
tslib_1.__decorate([
    (0, common_1.Get)('/linkedin/callback'),
    tslib_1.__param(0, (0, request_context_decorator_1.RequestCtx)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], LinkedinController.prototype, "linkedinLoginCallback", null);
exports.LinkedinController = LinkedinController = tslib_1.__decorate([
    (0, common_1.UseGuards)(common_2.FeatureFlagEnabledGuard, (0, passport_1.AuthGuard)('linkedin')),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_LINKEDIN_LOGIN),
    (0, common_2.Public)(),
    (0, common_1.Controller)('/auth'),
    tslib_1.__metadata("design:paramtypes", [social_auth_service_1.SocialAuthService])
], LinkedinController);
//# sourceMappingURL=linkedin.controller.js.map