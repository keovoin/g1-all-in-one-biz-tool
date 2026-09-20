"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const context_1 = require("../../core/context");
const type_orm_tenant_repository_1 = require("../../tenant/repository/type-orm-tenant.repository");
const tenant_service_1 = require("../../tenant/tenant.service");
const decorators_1 = require("../decorators");
const guards_1 = require("../guards");
const billing_service_1 = require("./billing.service");
/**
 * In-product billing pages for the signed-in tenant.
 *
 * Two management paths are supported on purpose and both are meant to be good: these endpoints back
 * the native billing screens, and `POST /billing/portal` hands the user to Stripe's own customer
 * portal for anything the native screens do not cover.
 *
 * Two rules hold across every route here:
 *
 *  1. **The Stripe customer is resolved from the request's tenant, never from the request body.**
 *     Accepting a customer id from the client would let any signed-in user read or cancel another
 *     tenant's subscription — the single largest risk in this feature.
 *  2. **404 when billing is not configured.** A self-hosted install has no Stripe account, and the
 *     billing section should be absent rather than present-and-broken. The UI keys off
 *     `GET /billing/config`.
 */
let BillingController = class BillingController {
    constructor(billingService, typeOrmTenantRepository, tenantService) {
        this.billingService = billingService;
        this.typeOrmTenantRepository = typeOrmTenantRepository;
        this.tenantService = tenantService;
    }
    /**
     * Whether this deployment does billing at all. Public to any signed-in user, because the UI has
     * to decide whether to render a billing section before it knows anything else.
     */
    async config() {
        // `mode` is deliberately visible: a staging environment showing "test" is how an operator
        // confirms at a glance that it is not wired to the live Stripe account.
        return { enabled: this.billingService.isBillingEnforced(), mode: this.billingService.mode };
    }
    async subscription() {
        const customerId = await this.requireCustomerId();
        return this.billingService.getSubscription(customerId);
    }
    async plans() {
        this.requireBillingEnabled();
        return this.billingService.listPlans(EVER_PRODUCT_KEY);
    }
    async changePlan(body) {
        const customerId = await this.requireCustomerId();
        // 400, not 404: this controller uses 404 to mean "billing is not configured on this
        // deployment", and reusing it for a missing field would make the two indistinguishable.
        const lookupKey = body?.lookupKey?.trim();
        if (!lookupKey) {
            throw new common_1.BadRequestException('A plan must be supplied.');
        }
        return this.billingService.changePlan(customerId, lookupKey, EVER_PRODUCT_KEY);
    }
    async cancel() {
        const customerId = await this.requireCustomerId();
        return this.billingService.cancelSubscription(customerId);
    }
    async resume() {
        const customerId = await this.requireCustomerId();
        return this.billingService.resumeSubscription(customerId);
    }
    async invoices() {
        const customerId = await this.requireCustomerId();
        return this.billingService.listInvoices(customerId);
    }
    async paymentMethod() {
        const customerId = await this.requireCustomerId();
        return this.billingService.getPaymentMethod(customerId);
    }
    /**
     * Hand off to Stripe's customer portal — the second supported management path.
     *
     * `returnUrl` comes from the caller, so it is restricted to the deployment's own web app: an
     * open redirect here would let a crafted link bounce a signed-in admin anywhere after a
     * legitimate-looking Stripe visit.
     */
    async portal(body) {
        const customerId = await this.requireCustomerId();
        const url = await this.billingService.createPortalSession(customerId, this.safeReturnUrl(body?.returnUrl));
        return { url };
    }
    /* ------------------------------------------------------------------ internals */
    requireBillingEnabled() {
        if (!this.billingService.isBillingEnforced()) {
            // Not a 403: on a self-hosted install this feature genuinely does not exist.
            throw new common_1.NotFoundException('Billing is not available on this deployment.');
        }
    }
    /**
     * The Stripe customer for the tenant making this request.
     *
     * Resolved from `RequestContext`, never from user input — see the class comment.
     */
    async requireCustomerId() {
        this.requireBillingEnabled();
        const tenantId = context_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.NotFoundException('No tenant in the current request.');
        }
        const tenant = await this.typeOrmTenantRepository.findOne({
            where: { id: tenantId },
            select: { id: true, stripeCustomerId: true }
        });
        const customerId = tenant?.stripeCustomerId?.trim();
        if (customerId)
            return customerId;
        // No link yet. That is the normal state for someone who has just bought: onboarding refuses to
        // make the link until the buyer has confirmed their email address, because an unconfirmed
        // address is not evidence of who they are. Once they have confirmed it, this resolves the link
        // on their first visit here.
        const linked = await this.tenantService.ensureStripeCustomerLink(tenantId, context_1.RequestContext.currentUserId());
        if (linked)
            return linked;
        throw new common_1.NotFoundException('This account is not linked to a billing customer.');
    }
    /**
     * Only same-origin return URLs.
     *
     * There is no hardcoded fallback on purpose. Defaulting to `https://app.gauzy.co` would send a
     * self-hosted operator's own users to a domain that operator does not control — so if
     * `CLIENT_BASE_URL` is not configured, this refuses rather than guesses.
     */
    safeReturnUrl(candidate) {
        const base = (process.env.CLIENT_BASE_URL || '').trim();
        if (!base) {
            throw new common_1.BadRequestException('CLIENT_BASE_URL is not configured, so there is no safe address to return you to after billing.');
        }
        if (candidate) {
            try {
                const url = new URL(candidate);
                if (url.origin === new URL(base).origin)
                    return url.toString();
            }
            catch {
                // Not a URL at all — fall through to the configured root.
            }
        }
        return base;
    }
};
exports.BillingController = BillingController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Whether billing is configured on this deployment' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, common_1.Get)('/config'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "config", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "The tenant's current subscription" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, common_1.Get)('/subscription'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "subscription", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Plans this tenant can switch to' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, common_1.Get)('/plans'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "plans", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Switch the subscription to another plan' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, common_1.Post)('/subscription/change'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "changePlan", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Cancel at the end of the current period' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, common_1.Post)('/subscription/cancel'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "cancel", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Undo a pending cancellation' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, common_1.Post)('/subscription/resume'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "resume", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Invoice history' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, common_1.Get)('/invoices'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "invoices", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'The card on file' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, common_1.Get)('/payment-method'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "paymentMethod", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Open the Stripe customer portal' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED }),
    (0, common_1.Post)('/portal'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "portal", null);
exports.BillingController = BillingController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Billing'),
    (0, common_1.Controller)('/billing'),
    tslib_1.__metadata("design:paramtypes", [billing_service_1.BillingService,
        type_orm_tenant_repository_1.TypeOrmTenantRepository,
        tenant_service_1.TenantService])
], BillingController);
/**
 * Which Ever product's plans this deployment offers. The catalog keys every price as
 * `ever_<product>_<hosting>_<tier>_<interval>`, and this platform is Gauzy.
 */
const EVER_PRODUCT_KEY = 'gauzy';
//# sourceMappingURL=billing.controller.js.map