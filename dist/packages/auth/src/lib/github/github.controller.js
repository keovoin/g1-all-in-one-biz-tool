"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const social_auth_service_1 = require("./../social-auth.service");
const request_context_decorator_1 = require("./../request-context.decorator");
let GithubController = class GithubController {
    constructor(service) {
        this.service = service;
    }
    /**
     * Initiates GitHub login.
     *
     * @param req
     */
    githubLogin(_req) {
        // This method is empty because AuthGuard('github') initiates the GitHub login
        // The user will be redirected to the GitHub login page by Passport
    }
    /**
     * GitHub login callback endpoint.
     *
     * @param _req - The context of the incoming request.
     * @param _res - The response object.
     * @returns The result of the GitHub login callback.
     */
    async githubLoginCallback(context, _res) {
        const { user } = context;
        // To-DO: Determine the frontend URL based on the request
        const { success, authData } = await this.service.validateOAuthLoginEmail(user.emails);
        return this.service.routeRedirect(success, authData, _res);
    }
};
exports.GithubController = GithubController;
tslib_1.__decorate([
    (0, common_1.Get)('/github'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], GithubController.prototype, "githubLogin", null);
tslib_1.__decorate([
    (0, common_1.Get)('/github/callback'),
    tslib_1.__param(0, (0, request_context_decorator_1.RequestCtx)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GithubController.prototype, "githubLoginCallback", null);
exports.GithubController = GithubController = tslib_1.__decorate([
    (0, common_1.UseGuards)(common_2.FeatureFlagEnabledGuard, (0, passport_1.AuthGuard)('github')),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_GITHUB_LOGIN),
    (0, common_2.Public)(),
    (0, common_1.Controller)('/auth'),
    tslib_1.__metadata("design:paramtypes", [social_auth_service_1.SocialAuthService])
], GithubController);
//# sourceMappingURL=github.controller.js.map