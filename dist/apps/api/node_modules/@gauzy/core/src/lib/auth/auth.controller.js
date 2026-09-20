"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const nestjs_i18n_1 = require("nestjs-i18n");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const context_1 = require("../core/context");
const pipes_1 = require("../shared/pipes");
const dto_1 = require("./../password-reset/dto");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const dto_2 = require("./../user/dto");
const auth_service_1 = require("./auth.service");
const commands_1 = require("./commands");
const dto_3 = require("./dto");
const dto_4 = require("./social-account/dto");
let AuthController = class AuthController {
    constructor(authService, commandBus) {
        this.authService = authService;
        this.commandBus = commandBus;
    }
    /**
     * Check if the user is authenticated.
     *
     * @returns
     */
    async authenticated() {
        const token = context_1.RequestContext.currentToken();
        return await this.authService.isAuthenticated(token);
    }
    /**
     * Check if the user has a specific role.
     *
     * @param query - Query parameters containing roles.
     * @returns
     */
    async hasRole(query) {
        return await this.authService.hasRole(query.roles);
    }
    /**
     * Check if the user has specific permissions.
     *
     * @param query - Query parameters containing permissions.
     * @returns
     */
    async hasPermissions(query) {
        return await this.authService.hasPermissions(query.permissions);
    }
    /**
     * Register a new user.
     *
     * @param input - User registration data.
     * @param languageCode - Language code.
     * @param origin - Origin
     * @returns
     */
    async register(input, languageCode, origin) {
        return await this.commandBus.execute(new commands_1.AuthRegisterCommand({
            originalUrl: origin,
            ...input
        }, languageCode));
    }
    /**
     * User login.
     *
     * @param input - User login data.
     * @returns
     */
    async login(input) {
        return await this.commandBus.execute(new commands_1.AuthLoginCommand(input));
    }
    /**
     * Sign in workspaces by email and password.
     *
     * @param input - User sign-in data.
     * @returns
     */
    async signinWorkspacesByPassword(input) {
        return await this.authService.signinWorkspacesByEmailPassword(input, (0, utils_1.parseToBoolean)(input.includeTeams));
    }
    /**
     * Check if any user with the given provider infos exists

     * @param input An object that contains the provider name and the provider Account ID
     * @returns A promise that resolves to a boolean specifying if the user exists or not
     */
    async socialSignupCheckIfUserExistsBySocial(input) {
        return await this.authService.socialSignupCheckIfUserExistsBySocial(input);
    }
    /**
     * Sign in workspaces by email social media.
     *
     * @param input - User sign-in data.
     * @returns
     */
    async signinWorkspacesBySocial(input) {
        return await this.authService.signinWorkspacesByEmailSocial(input, (0, utils_1.parseToBoolean)(input.includeTeams));
    }
    async linkUserToSocialAccount(input) {
        return await this.authService.linkUserToSocialAccount(input);
    }
    /**
     * Send a workspace sign-in code by email.
     *
     * @param entity - User email data.
     * @param locale - Language code.
     * @returns
     */
    async sendWorkspaceSigninCode(entity, locale) {
        return await this.commandBus.execute(new commands_1.WorkspaceSigninSendCodeCommand(entity, locale));
    }
    /**
     * Confirm workspace sign-in by email code.
     *
     * @param input - Workspace sign-in email verification data.
     * @returns
     */
    async signinWorkspacesByMagicCode(input) {
        return await this.authService.signinWorkspacesByMagicCode(input, (0, utils_1.parseToBoolean)(input.includeTeams));
    }
    /**
     * Sign in to a workspace by token.
     *
     * @param input - Workspace sign-in data.
     * @returns
     */
    async signinWorkspaceByToken(input) {
        return await this.commandBus.execute(new commands_1.WorkspaceSigninVerifyTokenCommand(input));
    }
    /**
     * Reset the user's password.
     *
     * @param request - Password change request data.
     * @returns
     */
    async resetPassword(request) {
        return await this.authService.resetPassword(request);
    }
    /**
     * Request a password reset.
     *
     * @param body - Password reset request data.
     * @param origin - Origin Request Header.
     * @param languageCode - Language code.
     * @returns
     */
    async requestPassword(body, origin, languageCode) {
        return await this.authService.requestResetPassword(body, languageCode, origin);
    }
    /**
     * Logout the user by revoking the provided refresh token and the current access token. If no refresh token is provided, it will attempt to revoke the current access token only. Any errors during the revocation process are logged but do not prevent the logout from completing.
     *
     * @param refreshToken The refresh token to be revoked. This is optional as the function will attempt to revoke the current access token regardless.
     * @returns void
     */
    async logout(refreshToken) {
        await this.authService.logout(refreshToken);
    }
    /**
     * Refresh the access token using a refresh token.
     *
     * @param input - Refresh token data.
     * @returns
     */
    async refreshToken(input) {
        return await this.authService.rotateTokens(input.refresh_token, input);
    }
    /**
     * Get all workspaces (tenants) that the current authenticated user has access to.
     *
     * @param includeTeams - Whether to include teams in the response (default: false).
     * @returns A promise that resolves to the user signin workspace response.
     */
    async getUserWorkspaces(includeTeams) {
        return await this.authService.getUserWorkspaces((0, utils_1.parseToBoolean)(includeTeams));
    }
    /**
     * Switch the current user to a different workspace (tenant).
     *
     * @param input - Switch workspace data containing tenant ID.
     * @returns A promise that resolves to the authentication response with new tokens or null if switching fails.
     */
    async switchWorkspace(input) {
        return await this.authService.switchWorkspace(input.tenantId);
    }
    /**
     * Switch to a different organization within the current workspace
     */
    async switchOrganization(input) {
        return await this.authService.switchOrganization(input.organizationId);
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check if user is authenticated' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The success server response' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad request response' }),
    (0, common_1.Get)('/authenticated'),
    (0, common_2.Public)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "authenticated", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check if the user has a specific role' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST }),
    (0, common_1.Get)('/role'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_3.HasRoleQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "hasRole", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check if the user has specific permissions' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST }),
    (0, common_1.Get)('/permissions'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_3.HasPermissionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "hasPermissions", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)('/register'),
    (0, common_2.Public)()
    // Order matters: RegisterAuthorizationGuard authenticates an admin creating a user and sets
    // request.user, which SubscriptionRequiredGuard then reads to let that case through without
    // demanding a subscription. SubscriptionRequiredGuard is inert unless STRIPE_SECRET_KEY is set.
    ,
    (0, common_1.UseGuards)(guards_1.RegisterAuthorizationGuard, guards_1.SubscriptionRequiredGuard),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__param(2, (0, common_1.Headers)('origin')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.RegisterUserDTO, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/login'),
    (0, common_2.Public)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.UserLoginDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/signin.email.password'),
    (0, common_2.Public)(),
    (0, pipes_1.UseValidationPipe)(),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.UserSigninWorkspaceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "signinWorkspacesByPassword", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/signup.provider.social'),
    (0, common_2.Public)(),
    (0, pipes_1.UseValidationPipe)(),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_4.FindUserBySocialLoginDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "socialSignupCheckIfUserExistsBySocial", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/signin.email.social'),
    (0, common_2.Public)(),
    (0, pipes_1.UseValidationPipe)(),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_4.SocialLoginBodyRequestDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "signinWorkspacesBySocial", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/signup.link.account'),
    (0, common_2.Public)(),
    (0, pipes_1.UseValidationPipe)(),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_4.SocialLoginBodyRequestDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "linkUserToSocialAccount", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/signin.email'),
    (0, common_2.Public)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.UserEmailDTO, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "sendWorkspaceSigninCode", null);
tslib_1.__decorate([
    (0, common_1.Post)('/signin.email/confirm'),
    (0, common_2.Public)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_3.WorkspaceSigninEmailVerifyDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "signinWorkspacesByMagicCode", null);
tslib_1.__decorate([
    (0, common_1.Post)('/signin.workspace'),
    (0, common_2.Public)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_3.WorkspaceSigninDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "signinWorkspaceByToken", null);
tslib_1.__decorate([
    (0, common_1.Post)('/reset-password'),
    (0, common_2.Public)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ChangePasswordRequestDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
tslib_1.__decorate([
    (0, common_1.Post)('/request-password'),
    (0, common_2.Public)(),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Headers)('origin')),
    tslib_1.__param(2, (0, nestjs_i18n_1.I18nLang)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ResetPasswordRequestDTO, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "requestPassword", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Logout user',
        description: 'Revokes the provided refresh token. If no token is supplied, ' +
            'the token from the current request context is used. ' +
            'Individual revocation failures are logged but do not cause the request to fail.'
    }),
    (0, swagger_1.ApiBody)({
        description: 'Optional token pair to revoke.',
        required: false,
        schema: {
            type: 'object',
            properties: {
                refresh_token: {
                    type: 'string',
                    description: 'Refresh token to revoke.'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully logged out. The provided token has been revoked.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Request body is malformed or contains unrecognized fields.'
    }),
    (0, common_1.Post)('/logout'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)('refresh_token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh token' }),
    (0, common_2.Public)(),
    (0, common_1.UseGuards)(guards_1.AuthRefreshGuard),
    (0, common_1.Post)('/refresh-token'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_3.RefreshTokenDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get user workspaces',
        description: 'Retrieve all workspaces (tenants) that the authenticated user has access to. Optionally include team information for each workspace.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved user workspaces.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated or no workspaces found.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('/workspaces'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    tslib_1.__param(0, (0, common_1.Query)('includeTeams')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "getUserWorkspaces", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Switch user workspace',
        description: 'Switch the authenticated user to a different workspace (tenant). Returns new authentication tokens for the target workspace.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully switched workspace. Returns new authentication tokens.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated or does not have access to the workspace.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid workspace switch request. Check that tenantId is a valid UUID.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/switch-workspace'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_3.SwitchWorkspaceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "switchWorkspace", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Switch to a different organization within the current workspace' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully switched organization. Returns new authentication tokens.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated or does not have access to the organization.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid organization switch request. Check that organizationId is a valid UUID.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/switch-organization'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.CHANGE_SELECTED_ORGANIZATION),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_3.SwitchOrganizationDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "switchOrganization", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('/auth'),
    tslib_1.__metadata("design:paramtypes", [auth_service_1.AuthService,
        cqrs_1.CommandBus])
], AuthController);
//# sourceMappingURL=auth.controller.js.map