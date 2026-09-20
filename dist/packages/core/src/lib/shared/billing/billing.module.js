"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const tenant_module_1 = require("../../tenant/tenant.module");
const user_module_1 = require("../../user/user.module");
const billing_controller_1 = require("./billing.controller");
const billing_service_1 = require("./billing.service");
const stripe_subscription_service_1 = require("./stripe-subscription.service");
const stripe_webhook_controller_1 = require("./stripe-webhook.controller");
/**
 * In-product billing pages, plus the hand-off to Stripe's customer portal.
 *
 * Always registered. Every route inside answers 404 unless STRIPE_SECRET_KEY is set, so a
 * self-hosted install carries the module but exposes no billing surface — cheaper and less
 * error-prone than conditionally wiring a module at boot.
 */
let BillingModule = class BillingModule {
};
exports.BillingModule = BillingModule;
exports.BillingModule = BillingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [role_permission_module_1.RolePermissionModule, tenant_module_1.TenantModule, user_module_1.UserModule],
        controllers: [billing_controller_1.BillingController, stripe_webhook_controller_1.StripeWebhookController],
        providers: [billing_service_1.BillingService, stripe_subscription_service_1.StripeSubscriptionService],
        exports: [billing_service_1.BillingService, stripe_subscription_service_1.StripeSubscriptionService]
    })
], BillingModule);
//# sourceMappingURL=billing.module.js.map