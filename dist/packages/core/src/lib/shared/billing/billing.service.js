"use strict";
var BillingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const stripe_subscription_service_1 = require("./stripe-subscription.service");
const STRIPE_API = 'https://api.stripe.com/v1';
let BillingService = BillingService_1 = class BillingService {
    constructor(stripeSubscriptionService) {
        this.stripeSubscriptionService = stripeSubscriptionService;
        this.logger = new common_1.Logger(BillingService_1.name);
        this.productNames = new Map();
    }
    /** Mirrors the subscription service's switch, so the controller only has to ask one object. */
    isBillingEnforced() {
        return this.stripeSubscriptionService.isBillingEnforced();
    }
    /** Which Stripe account this deployment talks to: live, test, or none at all. */
    get mode() {
        return this.stripeSubscriptionService.mode;
    }
    /**
     * The tenant's current subscription, or null when it has never had one.
     *
     * Cancelled and otherwise dead subscriptions are excluded: the billing page should say "no
     * subscription" rather than show a corpse.
     */
    async getSubscription(stripeCustomerId) {
        const current = await this.findCurrentSubscription(stripeCustomerId);
        return current ? this.toSubscription(current) : null;
    }
    /**
     * Plans this tenant could switch to, taken from the prices actually present in Stripe.
     *
     * `productKey` narrows the list to one Ever product (e.g. `gauzy`), since a Gauzy tenant should
     * not be offered Ever Demand's tiers.
     */
    async listPlans(productKey, hosting = 'cloud') {
        const prefix = `ever_${productKey}_${hosting}_`;
        // Paged, not truncated. One page holds 100 prices and the shared account already carries 40
        // across four products; the moment another product lands, a first-page-only read would start
        // dropping real plans out of the switcher with no error to notice.
        const prices = await this.listAll('/prices?active=true&expand[]=data.product');
        return prices
            .filter((price) => price.lookup_key?.startsWith(prefix))
            .map((price) => this.toPlan(price))
            .sort((a, b) => a.amount - b.amount);
    }
    /** Walk every page of a Stripe list endpoint. */
    async listAll(path) {
        const separator = path.includes('?') ? '&' : '?';
        const items = [];
        let startingAfter;
        for (;;) {
            const page = await this.get(`${path}${separator}limit=100${startingAfter ? `&starting_after=${startingAfter}` : ''}`);
            const rows = page.data ?? [];
            items.push(...rows);
            const last = rows[rows.length - 1];
            if (!page.has_more || !last?.id)
                return items;
            startingAfter = last.id;
        }
    }
    /**
     * Move the tenant's subscription onto another price.
     *
     * Proration is left to Stripe's default so an upgrade bills the difference immediately and a
     * downgrade credits it — surprising the customer with a bespoke proration rule is worse than
     * following the behaviour their invoice will explain.
     */
    async changePlan(stripeCustomerId, lookupKey, productKey, hosting = 'cloud') {
        // The catalog is shared by every Ever product, so a lookup key from another one is perfectly
        // valid in Stripe and would otherwise be accepted here — moving a Gauzy tenant onto, say,
        // Ever Demand's pricing. `listPlans` already narrows what the UI offers; this refuses anything
        // outside that set regardless of what the client sends.
        const allowedPrefix = `ever_${productKey}_${hosting}_`;
        if (!lookupKey.startsWith(allowedPrefix)) {
            throw new common_1.BadRequestException('That plan is not available for this product.');
        }
        const subscription = await this.requireSubscriptionObject(stripeCustomerId);
        const { data: prices } = await this.get(`/prices?lookup_keys[]=${encodeURIComponent(lookupKey)}&active=true&limit=1`);
        const price = prices?.[0];
        if (!price) {
            throw new common_1.NotFoundException(`No active plan with lookup key "${lookupKey}".`);
        }
        const item = subscription.items?.data?.[0];
        if (!item) {
            throw new common_1.BadRequestException('That subscription has no billable item to change.');
        }
        if (item.price?.id === price.id) {
            throw new common_1.BadRequestException('The subscription is already on that plan.');
        }
        const updated = await this.post(`/subscriptions/${subscription.id}`, {
            'items[0][id]': item.id,
            'items[0][price]': price.id,
            // A pending cancellation would otherwise survive the switch and quietly kill the new plan.
            cancel_at_period_end: 'false'
        }, planChangeIdempotencyKey(subscription, price.id));
        return this.toSubscription(updated);
    }
    /** Schedule cancellation for the end of the paid period — never an immediate cut-off. */
    async cancelSubscription(stripeCustomerId) {
        const subscription = await this.requireSubscriptionObject(stripeCustomerId);
        const updated = await this.post(`/subscriptions/${subscription.id}`, 
        // No idempotency key: setting this flag twice produces the same state as setting it once,
        // and a derived key here reproduced itself across cancel -> resume -> cancel, so Stripe
        // replayed the first response and the cancellation silently never happened.
        { cancel_at_period_end: 'true' });
        return this.toSubscription(updated);
    }
    /** Undo a pending cancellation while the period is still running. */
    async resumeSubscription(stripeCustomerId) {
        const subscription = await this.requireSubscriptionObject(stripeCustomerId);
        const updated = await this.post(`/subscriptions/${subscription.id}`, 
        // Naturally idempotent, for the same reason as cancelSubscription above.
        { cancel_at_period_end: 'false' });
        return this.toSubscription(updated);
    }
    /** Invoice history, newest first. */
    async listInvoices(stripeCustomerId, limit = 24) {
        const { data } = await this.get(`/invoices?customer=${encodeURIComponent(stripeCustomerId)}&limit=${limit}`);
        return (data ?? []).map((invoice) => ({
            id: invoice.id,
            number: invoice.number ?? null,
            status: invoice.status ?? null,
            amountPaid: invoice.amount_paid ?? 0,
            // An unpaid or failed invoice has amount_paid = 0, so a table showing only that renders the
            // row as $0.00 — exactly the invoices someone is looking for when something has gone wrong.
            amountDue: invoice.amount_due ?? invoice.amount_paid ?? 0,
            currency: invoice.currency,
            createdAt: new Date((invoice.created ?? 0) * 1000).toISOString(),
            hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
            invoicePdfUrl: invoice.invoice_pdf ?? null
        }));
    }
    /**
     * The card on file, or null when there is none (a free tier never collects one).
     *
     * Only the display fields Stripe exposes — brand, last four, expiry. Nothing here is card data in
     * any sense that matters; the number never reaches this system.
     */
    async getPaymentMethod(stripeCustomerId) {
        const { data } = await this.get(`/payment_methods?customer=${encodeURIComponent(stripeCustomerId)}&type=card&limit=1`);
        const card = data?.[0]?.card;
        if (!card)
            return null;
        return {
            brand: card.brand ?? null,
            last4: card.last4 ?? null,
            expMonth: card.exp_month ?? null,
            expYear: card.exp_year ?? null
        };
    }
    /**
     * A one-shot Stripe customer portal URL.
     *
     * This is the second of the two supported paths: the native pages cover the common cases, the
     * portal covers everything else — and keeps covering it as Stripe adds features we have not
     * built. In live mode it renders on the account's custom domain.
     */
    async createPortalSession(stripeCustomerId, returnUrl) {
        const session = await this.post('/billing_portal/sessions', {
            customer: stripeCustomerId,
            return_url: returnUrl
        });
        if (!session.url) {
            throw new common_1.BadRequestException('Stripe did not return a portal URL.');
        }
        return session.url;
    }
    /* ------------------------------------------------------------------ internals */
    /**
     * The subscription the billing page is about: the newest one still alive, so a resubscribe wins
     * over the subscription it replaced. Dead ones are excluded — the page should say "no
     * subscription" rather than show a corpse.
     *
     * `data.items.data.price.product` is five levels deep and Stripe expands at most four, so the
     * product name is resolved separately in toSubscription().
     */
    async findCurrentSubscription(stripeCustomerId) {
        const subscriptions = await this.listAll(`/subscriptions?customer=${encodeURIComponent(stripeCustomerId)}&status=all`);
        const live = subscriptions.filter((s) => LIVE_STATUSES.has(s.status));
        if (!live.length)
            return null;
        // Established subscriptions outrank `incomplete` ones before recency is considered. An
        // `incomplete` subscription is an attempt whose first payment never succeeded — abandoning a
        // checkout leaves one behind — and because it is newer than the subscription the customer
        // actually holds, sorting on `created` alone would surface the failed attempt as "your plan".
        // Cancel and change-plan would then act on the wrong object entirely, leaving the real
        // subscription untouched while reporting success.
        live.sort((a, b) => {
            const rank = (s) => (s.status === 'incomplete' ? 1 : 0);
            return rank(a) - rank(b) || (b.created ?? 0) - (a.created ?? 0);
        });
        return live[0];
    }
    async requireSubscriptionObject(stripeCustomerId) {
        const current = await this.findCurrentSubscription(stripeCustomerId);
        if (!current) {
            throw new common_1.NotFoundException('This account has no active subscription.');
        }
        return current;
    }
    async toSubscription(subscription) {
        const item = subscription.items?.data?.[0];
        const price = item?.price;
        return {
            id: subscription.id,
            status: subscription.status,
            planName: (await this.productNameFor(price)) ?? price?.nickname ?? 'Subscription',
            lookupKey: price?.lookup_key ?? undefined,
            amount: price?.unit_amount ?? 0,
            currency: price?.currency ?? 'usd',
            interval: toInterval(price),
            trialEndsAt: toIso(subscription.trial_end),
            renewsAt: toIso(subscription.current_period_end),
            cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end)
        };
    }
    /**
     * The display name of a price's product.
     *
     * Subscription payloads carry `price.product` as a bare id — it sits one level below Stripe's
     * four-level expand ceiling — so it is fetched here and memoised. Product names change rarely and
     * the cache lives only as long as the request handler's service instance.
     */
    async productNameFor(price) {
        if (!price?.product)
            return undefined;
        if (typeof price.product === 'object')
            return price.product.name;
        const productId = price.product;
        const cached = this.productNames.get(productId);
        if (cached)
            return cached;
        try {
            const product = await this.get(`/products/${encodeURIComponent(productId)}`);
            if (product?.name) {
                this.productNames.set(productId, product.name);
                return product.name;
            }
        }
        catch (error) {
            // A missing name is cosmetic; the caller falls back to the nickname or a generic label.
            this.logger.warn(`Could not read Stripe product ${productId}: ${error.message}`);
        }
        return undefined;
    }
    toPlan(price) {
        const product = typeof price.product === 'object' ? price.product : undefined;
        const metadata = { ...(product?.metadata ?? {}), ...(price.metadata ?? {}) };
        return {
            lookupKey: price.lookup_key,
            priceId: price.id,
            productName: product?.name ?? price.lookup_key,
            amount: price.unit_amount ?? 0,
            currency: price.currency,
            interval: toInterval(price),
            tier: metadata.ever_tier,
            hosting: metadata.ever_hosting,
            product: metadata.ever_product
        };
    }
    get(path) {
        return this.request('GET', path);
    }
    /**
     * `idempotencyKey` makes a retried POST safe. Without it, a network blip on a plan change can
     * leave the caller unsure whether the switch happened, and a retry would apply it twice — with a
     * proration invoice each time. Stripe replays the original response instead when the key repeats.
     */
    post(path, form, idempotencyKey) {
        return this.request('POST', path, form, idempotencyKey);
    }
    async request(method, path, form, idempotencyKey) {
        // Through the subscription service rather than the environment, so this path cannot route
        // around the rules that live there. Reading STRIPE_SECRET_KEY directly here meant the demo
        // refusal and the live-mode opt-in applied to the registration gate but not to the billing
        // endpoints — a demo deployment with a key present would still have reached Stripe, and an
        // un-opted-in live key would still have moved real money, from the one surface that cancels
        // subscriptions and charges prorations.
        let key;
        try {
            key = this.stripeSubscriptionService.requireKey();
        }
        catch {
            throw new common_1.BadRequestException('Billing is not configured on this deployment.');
        }
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10000);
        try {
            const response = await fetch(`${STRIPE_API}${path}`, {
                method,
                headers: {
                    Authorization: `Bearer ${key}`,
                    'Stripe-Version': '2025-02-24.acacia',
                    ...(form ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
                    ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {})
                },
                body: form ? new URLSearchParams(form).toString() : undefined,
                signal: controller.signal
            });
            // A proxy or gateway in front of Stripe can answer with HTML, so parsing is not assumed.
            const raw = await response.text();
            let json;
            try {
                json = raw ? JSON.parse(raw) : {};
            }
            catch {
                this.logger.error(`Stripe ${method} ${path} -> ${response.status}: non-JSON response`);
                throw new common_1.ServiceUnavailableException('Billing is temporarily unavailable.');
            }
            if (!response.ok) {
                const message = json?.error?.message ?? `Stripe ${method} ${path} failed`;
                this.logger.error(`Stripe ${method} ${path} -> ${response.status}: ${message}`);
                throw stripeStatusToException(response.status, message);
            }
            return json;
        }
        catch (error) {
            // An aborted fetch is our timeout firing, not a client mistake; without this it surfaces
            // as an unhandled AbortError and the caller sees a 500.
            if (error instanceof Error && error.name === 'AbortError') {
                this.logger.error(`Stripe ${method} ${path} timed out`);
                throw new common_1.GatewayTimeoutException('Billing did not respond in time. Please try again.');
            }
            throw error;
        }
        finally {
            clearTimeout(timer);
        }
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [stripe_subscription_service_1.StripeSubscriptionService])
], BillingService);
/**
 * Map a Stripe HTTP status onto an accurate one of ours.
 *
 * Everything used to become a 400, which told the caller they had made a mistake even when the real
 * cause was our expired key, our rate limit, or Stripe being down — and a 400 invites the client to
 * "fix" a request that was never wrong, rather than retry.
 */
function stripeStatusToException(status, message) {
    if (status === 401 || status === 403) {
        // Our credentials, not the caller's problem — never echo Stripe's wording to them.
        return new common_1.UnauthorizedException('Billing is not correctly configured on this deployment.');
    }
    if (status === 404)
        return new common_1.NotFoundException(message);
    if (status === 429)
        return new common_1.ServiceUnavailableException('Billing is busy. Please try again shortly.');
    if (status >= 500)
        return new common_1.ServiceUnavailableException('Billing is temporarily unavailable.');
    return new common_1.BadRequestException(message);
}
/**
 * How long two identical plan changes are treated as one intent.
 *
 * Long enough to absorb a double-click and a transport-level retry, short enough to be irrelevant to
 * anything a person does deliberately.
 */
const IDEMPOTENCY_WINDOW_MS = 60 * 1000;
/**
 * A key for a plan change that collapses a duplicate but never a genuine second change.
 *
 * Only `changePlan` gets one. Cancel and resume set `cancel_at_period_end` to a fixed value, so
 * applying either twice lands on exactly the state one application would produce; there is nothing
 * for an idempotency key to protect, and — as an earlier version of this code proved — a *derived*
 * key on those operations can only cause harm. That version mixed in the subscription's current
 * state, on the reasoning that cancel -> resume -> cancel would then yield three distinct keys. It
 * does not: the state is read *before* the call, and a resume restores exactly the state that
 * preceded the first cancel, so the second cancel reproduced the first one's key and body. Stripe
 * replayed the stored response without touching the subscription, the API reported
 * `cancelAtPeriodEnd: true`, and the customer was charged at the period boundary for a subscription
 * the product had told them was cancelled. Removing the key removes the failure outright.
 *
 * A plan change genuinely must not repeat, because each application raises a proration invoice. The
 * key therefore mixes in `latest_invoice`, which advances every time a proration is actually
 * charged. That is what makes an A -> B -> A -> B sequence four distinct keys where a state
 * fingerprint would have produced two: the invoice id after the second change is not the invoice id
 * after the first, so the fourth change cannot replay the first. The time window then covers the
 * remaining case the invoice id cannot — two concurrent duplicates of the *same* change, which race
 * past the already-on-that-plan check before either has been applied.
 */
function planChangeIdempotencyKey(subscription, targetPriceId) {
    const window = Math.floor(Date.now() / IDEMPOTENCY_WINDOW_MS);
    const currentPrice = subscription.items?.data?.[0]?.price?.id ?? 'none';
    const latestInvoice = typeof subscription.latest_invoice === 'string'
        ? subscription.latest_invoice
        : subscription.latest_invoice?.id ?? 'none';
    return ['change', subscription.id, currentPrice, targetPriceId, latestInvoice, String(window)].join(':');
}
/** Statuses that represent a subscription the customer still has. */
const LIVE_STATUSES = new Set(['active', 'trialing', 'past_due', 'unpaid', 'incomplete']);
/** Stripe's recurring interval, or `one_time` for a price with no `recurring` block. */
function toInterval(price) {
    const interval = price?.recurring?.interval;
    if (interval === 'day' || interval === 'week' || interval === 'month' || interval === 'year') {
        return interval;
    }
    return price?.recurring ? 'month' : 'one_time';
}
function toIso(seconds) {
    return seconds ? new Date(seconds * 1000).toISOString() : null;
}
//# sourceMappingURL=billing.service.js.map