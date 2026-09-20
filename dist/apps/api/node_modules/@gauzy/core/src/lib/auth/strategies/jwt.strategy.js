"use strict";
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@gauzy/config");
const auth_service_1 = require("../auth.service");
const employee_service_1 = require("../../employee/employee.service");
const role_authorization_service_1 = require("../../role/role-authorization.service");
const user_organization_services_1 = require("../../user-organization/user-organization.services");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(_authService, _employeeService, _userOrganizationService, _roleAuthorizationService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config_1.environment.JWT_SECRET
        });
        this._authService = _authService;
        this._employeeService = _employeeService;
        this._userOrganizationService = _userOrganizationService;
        this._roleAuthorizationService = _roleAuthorizationService;
        this.logger = new common_1.Logger(JwtStrategy_1.name);
        this.loggingEnabled = false;
    }
    /**
     * Validates the JWT payload.
     * @param {JwtPayload} payload - The JWT payload to validate.
     * @param {Function} done - The callback function to call when validation is complete.
     * @returns {void}
     */
    async validate(payload, done) {
        try {
            const { id, thirdPartyId, employeeId, organizationId, tenantId } = payload;
            if (this.loggingEnabled) {
                this.logger.debug(`Validate JWT payload for user: ${payload?.id}`);
            }
            // An access token identifies its user by `id` (or `thirdPartyId`). Other JWTs are signed
            // with the same JWT_SECRET but carry no such claim (invite, estimate, team-join,
            // appointment, magic-code tokens); a lookup by an undefined id used to fall through to
            // the FIRST user in the table, so such a token authenticated as that user. Reject them here.
            if (!id && !thirdPartyId) {
                return done(new common_1.UnauthorizedException('unauthorized'), false);
            }
            // We use this to also attach the user object to the request context.
            const user = await this._authService.getAuthenticatedUser(id, thirdPartyId);
            // A token outlives the account it was issued for. Deactivating or archiving a user is an
            // off-boarding or incident-response control, and it has to end the session on the NEXT request
            // rather than whenever the token happens to expire (up to JWT_TOKEN_EXPIRATION_TIME, 24h by
            // default). These are the exact predicates (`isActive: true, isArchived: false`) that `login()`
            // and `getJwtAccessToken()` already apply at issuance, so no one who holds a token today is
            // locked out by them — and an account whose status is unknown (NULL) is refused, as it is there.
            if (!user || user.isActive !== true || user.isArchived !== false) {
                return done(new common_1.UnauthorizedException('unauthorized'), false);
            }
            // Pin the role and permissions the user holds RIGHT NOW onto the request. Every
            // RequestContext.hasRoles/hasPermissions check during this request reads them instead of the
            // `role` / `permissions` claims frozen into the token, so a demotion also takes effect on the
            // next request. If the role cannot be resolved the user gets none — authorization fails closed.
            await this._roleAuthorizationService.attachAuthorizationState(user);
            // Validate and assign employeeId from JWT
            let validatedEmployee = null;
            if (employeeId) {
                const employee = await this._employeeService.findOneByIdString(employeeId);
                // Same reasoning as for the user above: a deactivated or archived employee record must not
                // keep granting the employee context its token was minted with.
                if (!employee ||
                    employee.userId !== user.id ||
                    employee.isActive !== true ||
                    employee.isArchived !== false) {
                    return done(new common_1.UnauthorizedException('unauthorized'), false);
                }
                validatedEmployee = employee;
                user.employeeId = employeeId;
            }
            // Validate and assign organizationId from JWT
            if (organizationId) {
                // Cross-validate: if employeeId was provided, ensure it belongs to the claimed organization
                if (validatedEmployee && validatedEmployee.organizationId !== organizationId) {
                    return done(new common_1.UnauthorizedException('Employee does not belong to the claimed organization'), false);
                }
                const userOrganization = await this._userOrganizationService.findOneByOptions({
                    where: {
                        userId: user.id,
                        organizationId,
                        tenantId: tenantId || user.tenantId,
                        isActive: true,
                        isArchived: false
                    }
                });
                if (!userOrganization) {
                    return done(new common_1.UnauthorizedException('User does not have access to organization'), false);
                }
                user.lastOrganizationId = organizationId;
            }
            if (this.loggingEnabled) {
                this.logger.debug(`Getting user tenantId from JWT strategy: ${user.tenantId ?? 'undefined'}`);
            }
            done(null, user);
        }
        catch (error) {
            this.logger.error(`Error occurred during JWT validation: ${error?.message}`, error?.stack, 'JwtStrategy');
            return done(new common_1.UnauthorizedException('unauthorized', error.message), false);
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [auth_service_1.AuthService,
        employee_service_1.EmployeeService,
        user_organization_services_1.UserOrganizationService,
        role_authorization_service_1.RoleAuthorizationService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map