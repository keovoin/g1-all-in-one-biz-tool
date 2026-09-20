"use strict";
var StripeWebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crypto_1 = require("crypto");
const typeorm_1 = require("typeorm");
const common_2 = require("@gauzy/common");
const type_orm_tenant_repository_1 = require("../../tenant/repository/type-orm-tenant.repository");
const type_orm_user_repository_1 = require("../../user/repository/type-orm-user.repository");
const stripe_subscription_service_1 = require("./stripe-subscription.service");
/**
 * Stripe webhook receiver.
 *
 * The native billing pages read live from Stripe, so nothing here is needed to render them. What
 * this does is keep the tenant → customer link correct when a subscription is created or replaced
 * somewhere the platform never saw — through the Stripe customer portal, through the Dashboard, or
 * through a second checkout by the same person.
 *
 * Unsigned or unverifiable payloads are rejected. A webhook endpoint that trusts its body is an
 * unauthenticated write into the billing state of every tenant, so the signature check is not
 * optional and there is no bypass for local development.
 */
let StripeWebhookController = StripeWebhookController_1 = class StripeWebhookController {
    constructor(stripeSubscriptionService, typeOrmTenantRepository, typeOrmUserRepository) {
        this.stripeSubscriptionService = stripeSubscriptionService;
        this.typeOrmTenantRepository = typeOrmTenantRepository;
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.logger = new common_1.Logger(StripeWebhookController_1.name);
    }
    async handle(request) {
        const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
        // Absent secret means this deployment does not do billing. Refuse rather than silently accept:
        // an endpoint that returns 200 to anything is indistinguishable from one that works.
        if (!secret || !this.stripeSubscriptionService.isBillingEnforced()) {
            throw new common_1.ForbiddenException('Billing webhooks are not enabled on this deployment.');
        }
        const signature = request.headers['stripe-signature'];
        const payload = request.rawBody;
        if (typeof signature !== 'string' || !payload) {
            throw new common_1.ForbiddenException('Missing Stripe signature.');
        }
        if (!verifySignature(payload, signature, secret)) {
            throw new common_1.ForbiddenException('Invalid Stripe signature.');
        }
        let event;
        try {
            event = JSON.parse(payload.toString('utf8'));
        }
        catch {
            throw new common_1.ForbiddenException('Malformed webhook payload.');
        }
        // Always 200 once the signature is good — which means the handler's own failures must be
        // swallowed here, not propagated. Stripe retries on any non-2xx, so a bug in apply() would
        // otherwise turn into a retry storm, and a dropped event we can replay from the Dashboard is
        // the cheaper failure.
        try {
            await this.apply(event);
        }
        catch (error) {
            this.logger.error(`Failed to apply Stripe webhook ${event.type}; acknowledging anyway. ${error instanceof Error ? error.message : error}`);
        }
        return { received: true };
    }
    /**
     * React to the handful of events that can change which customer a tenant bills through.
     *
     * Everything else — status transitions, invoice payments — is read live by the billing pages, so
     * mirroring it into our database would only create a second copy to keep in sync.
     */
    async apply(event) {
        if (!LINKING_EVENTS.has(event.type))
            return;
        const object = event.data?.object ?? {};
        // `customer` is an id string normally, but an expanded object when the event was created with
        // expansion — take the id either way rather than silently ignoring the expanded form.
        const customerId = typeof object.customer === 'string' ? object.customer : object.customer?.id;
        if (!customerId)
            return;
        // Only `checkout.session.completed` carries the address inline. A Subscription object has no
        // email field at all, so reading it off the event alone would make `customer.subscription.created`
        // a permanent no-op — precisely the portal- and Dashboard-created subscriptions this receiver
        // exists to catch. Fall back to asking Stripe, which costs one request on that path only.
        const email = object.customer_email ??
            object.customer_details?.email ??
            (await this.stripeSubscriptionService.getCustomerEmail(customerId));
        if (!email)
            return;
        // Tenant has no `users` relation, so the tenant is reached through the user that owns the
        // email rather than by joining from the other side.
        // Deliberately not `.catch(() => null)`: a transient database error would then be
        // indistinguishable from "nobody has this address", and the event would be acknowledged as
        // handled when nothing happened. Letting it throw sends it to the handler above, which logs
        // it — and the event can still be replayed from the Stripe dashboard.
        const users = await this.typeOrmUserRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.tenantId', 'user.emailVerifiedAt'])
            .where('LOWER(user.email) = LOWER(:email)', { email: email.toLowerCase() })
            .andWhere('user.tenantId IS NOT NULL')
            .limit(2)
            .getMany();
        // One address can exist in more than one tenant. Picking arbitrarily would attach a Stripe
        // customer to whichever row the database happened to return first, so this declines instead
        // and leaves the link to be made deliberately.
        if (users.length !== 1) {
            if (users.length > 1) {
                this.logger.warn(`Stripe ${event.type} matched ${users.length} tenants for one address; not linking automatically.`);
            }
            return;
        }
        const user = users[0];
        if (!user?.tenantId)
            return;
        // The address in this event is whatever the payer typed at checkout, and email is not unique in
        // this platform, so matching on it alone would let someone who registered under a paying
        // customer's address receive that customer's Stripe account. Requiring the matched user to have
        // confirmed the address closes that, on the same reasoning as the onboarding path — an attacker
        // can type a victim's address but cannot read their mail. An unverified match is left alone; the
        // link is made later, once the address is confirmed.
        if (!user.emailVerifiedAt) {
            this.logger.log(`Stripe ${event.type} matched an unverified address; not linking automatically.`);
            return;
        }
        // Never adopt a Stripe customer that another tenant already bills through. The write below
        // guards the *target* tenant from being repointed, but says nothing about the customer: two
        // tenants could end up sharing one billing account, and whichever opened /billing would be
        // looking at the other's invoices, card and subscription. The onboarding path has refused
        // this since it was written; the webhook reaches the same column and had no equivalent.
        const claimedBy = await this.typeOrmTenantRepository.findOne({
            where: { stripeCustomerId: customerId },
            select: { id: true }
        });
        if (claimedBy && claimedBy.id !== user.tenantId) {
            this.logger.warn(`Stripe ${event.type} would link tenant ${user.tenantId} to a customer already held by ` +
                `tenant ${claimedBy.id}; declining.`);
            return;
        }
        // Only fill a gap; never repoint a tenant that already has a customer. Overwriting that link
        // from a webhook would let a stray event move a tenant's billing onto another account.
        const updated = await this.typeOrmTenantRepository.update({ id: user.tenantId, stripeCustomerId: (0, typeorm_1.IsNull)() }, { stripeCustomerId: customerId });
        if (updated.affected) {
            this.logger.log(`Linked tenant ${user.tenantId} to Stripe customer ${customerId} from ${event.type}.`);
        }
    }
};
exports.StripeWebhookController = StripeWebhookController;
tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.Post)('/'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], StripeWebhookController.prototype, "handle", null);
exports.StripeWebhookController = StripeWebhookController = StripeWebhookController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)('/billing/webhook'),
    tslib_1.__metadata("design:paramtypes", [stripe_subscription_service_1.StripeSubscriptionService,
        type_orm_tenant_repository_1.TypeOrmTenantRepository,
        type_orm_user_repository_1.TypeOrmUserRepository])
], StripeWebhookController);
/** Events that can establish a tenant's billing customer for the first time. */
const LINKING_EVENTS = new Set(['checkout.session.completed', 'customer.subscription.created']);
/**
 * Verify Stripe's `Stripe-Signature` header.
 *
 * Implemented directly rather than via the SDK so the platform gains no dependency for a feature
 * self-hosted installs never enable. The scheme is documented and small: `t=<unix>,v1=<hmac>`, where
 * the HMAC is SHA-256 over `<t>.<raw body>` keyed by the endpoint secret.
 */
function verifySignature(payload, header, secret) {
    const parts = header.split(',').reduce((acc, part) => {
        const [key, value] = part.split('=', 2);
        if (key && value)
            (acc[key] ??= []).push(value);
        return acc;
    }, {});
    const timestamp = parts['t']?.[0];
    const signatures = parts['v1'] ?? [];
    if (!timestamp || !signatures.length)
        return false;
    // Reject anything older than five minutes so a captured request cannot be replayed later.
    const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
    if (!Number.isFinite(ageSeconds) || ageSeconds > 300)
        return false;
    const expected = (0, crypto_1.createHmac)('sha256', secret).update(`${timestamp}.`).update(payload).digest('hex');
    // Stripe may send several signatures while a secret is being rotated; any one matching is enough.
    return signatures.some((candidate) => {
        const a = Buffer.from(candidate, 'utf8');
        const b = Buffer.from(expected, 'utf8');
        return a.length === b.length && (0, crypto_1.timingSafeEqual)(a, b);
    });
}
//# sourceMappingURL=stripe-webhook.controller.js.map