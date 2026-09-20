"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const tslib_1 = require("tslib");
const auth_1 = require("@gauzy/auth");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const access_token_module_1 = require("../access-token/access-token.module");
const email_send_module_1 = require("../email-send/email-send.module");
const employee_module_1 = require("../employee/employee.module");
const event_bus_module_1 = require("../event-bus/event-bus.module");
const feature_module_1 = require("../feature/feature.module");
const organization_team_module_1 = require("../organization-team/organization-team.module");
const organization_module_1 = require("../organization/organization.module");
const password_reset_module_1 = require("../password-reset/password-reset.module");
const refresh_token_module_1 = require("../refresh-token/refresh-token.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const role_module_1 = require("../role/role.module");
// Deep path, not the '../shared/billing' barrel. The barrel re-exports BillingModule, which
// imports TenantModule, which imports this module — so importing the barrel here closes a
// require cycle (billing.module -> tenant.module -> auth.module -> billing/index ->
// billing.module). TenantModule is then still mid-evaluation when BillingModule's @Module()
// decorator runs, and its imports array gets `undefined` where TenantModule should be, which
// Nest rejects at boot on every deployment — including self-hosted installs that never
// configure Stripe. tenant.module.ts imports this service by the deep path for the same reason.
const stripe_subscription_service_1 = require("../shared/billing/stripe-subscription.service");
const user_organization_module_1 = require("../user-organization/user-organization.module");
const user_organization_services_1 = require("../user-organization/user-organization.services");
const user_module_1 = require("../user/user.module");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const handlers_1 = require("./commands/handlers");
const email_confirmation_service_1 = require("./email-confirmation.service");
const email_verification_controller_1 = require("./email-verification.controller");
const login_attempt_module_1 = require("./login-attempt.module");
const social_account_module_1 = require("./social-account/social-account.module");
const oauth_client_module_1 = require("./oauth-client/oauth-client.module");
const terms_acceptance_module_1 = require("../terms-acceptance/terms-acceptance.module");
const strategies_1 = require("./strategies");
// Core service providers for handling authentication and related functionalities
const providers = [
    auth_service_1.AuthService,
    email_confirmation_service_1.EmailConfirmationService,
    user_organization_services_1.UserOrganizationService,
    // Backs SubscriptionRequiredGuard on the register route. Inert unless STRIPE_SECRET_KEY is set,
    // so self-hosted installs are unaffected by its presence here.
    stripe_subscription_service_1.StripeSubscriptionService
];
// Authentication strategies for token validation and management
const strategies = [strategies_1.JwtStrategy, strategies_1.JwtRefreshTokenStrategy];
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            auth_1.SocialAuthModule.registerAsync({
                imports: [
                    axios_1.HttpModule,
                    AuthModule,
                    email_send_module_1.EmailSendModule,
                    user_module_1.UserModule,
                    (0, common_1.forwardRef)(() => user_organization_module_1.UserOrganizationModule),
                    employee_module_1.EmployeeModule,
                    role_module_1.RoleModule,
                    organization_module_1.OrganizationModule,
                    organization_team_module_1.OrganizationTeamModule,
                    password_reset_module_1.PasswordResetModule,
                    cqrs_1.CqrsModule,
                    social_account_module_1.SocialAccountModule,
                    event_bus_module_1.EventBusModule,
                    role_permission_module_1.RolePermissionModule,
                    access_token_module_1.AccessTokenModule,
                    refresh_token_module_1.RefreshTokenModule,
                    oauth_client_module_1.OAuthClientModule,
                    terms_acceptance_module_1.TermsAcceptanceModule,
                    login_attempt_module_1.LoginAttemptModule
                ],
                useClass: auth_service_1.AuthService
            }),
            email_send_module_1.EmailSendModule,
            user_module_1.UserModule,
            (0, common_1.forwardRef)(() => user_organization_module_1.UserOrganizationModule),
            employee_module_1.EmployeeModule,
            role_module_1.RoleModule,
            organization_module_1.OrganizationModule,
            organization_team_module_1.OrganizationTeamModule,
            password_reset_module_1.PasswordResetModule,
            feature_module_1.FeatureModule,
            cqrs_1.CqrsModule,
            social_account_module_1.SocialAccountModule,
            event_bus_module_1.EventBusModule,
            role_permission_module_1.RolePermissionModule,
            access_token_module_1.AccessTokenModule,
            refresh_token_module_1.RefreshTokenModule,
            oauth_client_module_1.OAuthClientModule,
            terms_acceptance_module_1.TermsAcceptanceModule,
            login_attempt_module_1.LoginAttemptModule
        ],
        controllers: [auth_controller_1.AuthController, email_verification_controller_1.EmailVerificationController],
        providers: [...providers, ...handlers_1.CommandHandlers, ...strategies],
        exports: [...providers]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map