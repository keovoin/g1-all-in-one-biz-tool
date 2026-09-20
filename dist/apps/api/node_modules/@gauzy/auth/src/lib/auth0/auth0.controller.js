"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth0Controller = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const common_2 = require("@gauzy/common");
const social_auth_service_1 = require("./../social-auth.service");
const request_context_decorator_1 = require("./../request-context.decorator");
let Auth0Controller = class Auth0Controller {
    constructor(service) {
        this.service = service;
    }
    /**
     * Handles the initial Auth0 login request.
     *
     * @param req - The incoming request object, typically used to access request data or user information.
     */
    auth0Login(_) { }
    /**
     * Handles the callback from Auth0 after a successful login.
     *
     * @param context - The context of the incoming request, including the authenticated user information.
     * @param res - The response object used to send a redirect or response to the client.
     * @returns {Promise<void>} - A promise that resolves after redirecting the user.
     */
    async auth0LoginCallback(context, res) {
        const { user } = context;
        const { success, authData } = await this.service.validateOAuthLoginEmail(user.emails);
        return this.service.routeRedirect(success, authData, res);
    }
};
exports.Auth0Controller = Auth0Controller;
tslib_1.__decorate([
    (0, common_1.Get)('/auth0'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Auth0Controller.prototype, "auth0Login", null);
tslib_1.__decorate([
    (0, common_1.Get)('/auth0/callback'),
    tslib_1.__param(0, (0, request_context_decorator_1.RequestCtx)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], Auth0Controller.prototype, "auth0LoginCallback", null);
exports.Auth0Controller = Auth0Controller = tslib_1.__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('auth0')),
    (0, common_2.Public)(),
    (0, common_1.Controller)('/auth'),
    tslib_1.__metadata("design:paramtypes", [social_auth_service_1.SocialAuthService])
], Auth0Controller);
//# sourceMappingURL=auth0.controller.js.map