import { StripeSubscriptionService } from './stripe-subscription.service';
/**
 * Everything the in-product billing pages need, and nothing they do not.
 *
 * Two ways to manage a subscription are supported deliberately and both must stay good: these
 * endpoints power the native billing screens inside the product, and `createPortalSession()` hands
 * the user to Stripe's own customer portal for anything the native screens do not cover. The portal
 * is the escape hatch, not the primary experience.
 *
 * Available plans are read back out of **Stripe** rather than from a catalog file copied into this
 * repo. The catalog is defined once, on the checkout host, and synced into Stripe; reading Stripe
 * here means the platform can never drift from what is actually purchasable.
 *
 * Every method is inert-by-construction: callers must check `isBillingEnforced()` first, and the
 * controller hides the whole surface when Stripe is not configured.
 */
/**
 * Stripe supports `day`, `week`, `month` and `year`. Collapsing everything non-yearly to `month`
 * would show a weekly plan as monthly — wrong about the customer's own billing period.
 */
export type BillingInterval = 'day' | 'week' | 'month' | 'year' | 'one_time';
export interface BillingPlan {
    /** `ever_<product>_<hosting>_<tier>_<interval>` — stable across price replacements. */
    lookupKey: string;
    priceId: string;
    productName: string;
    amount: number;
    currency: string;
    interval: BillingInterval;
    tier?: string;
    hosting?: string;
    product?: string;
}
export interface BillingSubscription {
    id: string;
    status: string;
    planName: string;
    lookupKey?: string;
    amount: number;
    currency: string;
    interval: BillingInterval;
    /** ISO timestamps, or null where Stripe does not supply one. */
    trialEndsAt: string | null;
    renewsAt: string | null;
    /** True when the subscription is set to stop at the end of the current period. */
    cancelAtPeriodEnd: boolean;
}
export interface BillingInvoice {
    id: string;
    number: string | null;
    status: string | null;
    amountPaid: number;
    /** What the invoice asks for. Differs from amountPaid whenever it is unpaid, open, or failed. */
    amountDue: number;
    currency: string;
    createdAt: string;
    hostedInvoiceUrl: string | null;
    invoicePdfUrl: string | null;
}
export interface BillingPaymentMethod {
    brand: string | null;
    last4: string | null;
    expMonth: number | null;
    expYear: number | null;
}
export declare class BillingService {
    private readonly stripeSubscriptionService;
    private readonly logger;
    constructor(stripeSubscriptionService: StripeSubscriptionService);
    /** Mirrors the subscription service's switch, so the controller only has to ask one object. */
    isBillingEnforced(): boolean;
    /** Which Stripe account this deployment talks to: live, test, or none at all. */
    get mode(): 'live' | 'test' | 'disabled';
    /**
     * The tenant's current subscription, or null when it has never had one.
     *
     * Cancelled and otherwise dead subscriptions are excluded: the billing page should say "no
     * subscription" rather than show a corpse.
     */
    getSubscription(stripeCustomerId: string): Promise<BillingSubscription | null>;
    /**
     * Plans this tenant could switch to, taken from the prices actually present in Stripe.
     *
     * `productKey` narrows the list to one Ever product (e.g. `gauzy`), since a Gauzy tenant should
     * not be offered Ever Demand's tiers.
     */
    listPlans(productKey: string, hosting?: string): Promise<BillingPlan[]>;
    /** Walk every page of a Stripe list endpoint. */
    private listAll;
    /**
     * Move the tenant's subscription onto another price.
     *
     * Proration is left to Stripe's default so an upgrade bills the difference immediately and a
     * downgrade credits it — surprising the customer with a bespoke proration rule is worse than
     * following the behaviour their invoice will explain.
     */
    changePlan(stripeCustomerId: string, lookupKey: string, productKey: string, hosting?: string): Promise<BillingSubscription>;
    /** Schedule cancellation for the end of the paid period — never an immediate cut-off. */
    cancelSubscription(stripeCustomerId: string): Promise<BillingSubscription>;
    /** Undo a pending cancellation while the period is still running. */
    resumeSubscription(stripeCustomerId: string): Promise<BillingSubscription>;
    /** Invoice history, newest first. */
    listInvoices(stripeCustomerId: string, limit?: number): Promise<BillingInvoice[]>;
    /**
     * The card on file, or null when there is none (a free tier never collects one).
     *
     * Only the display fields Stripe exposes — brand, last four, expiry. Nothing here is card data in
     * any sense that matters; the number never reaches this system.
     */
    getPaymentMethod(stripeCustomerId: string): Promise<BillingPaymentMethod | null>;
    /**
     * A one-shot Stripe customer portal URL.
     *
     * This is the second of the two supported paths: the native pages cover the common cases, the
     * portal covers everything else — and keeps covering it as Stripe adds features we have not
     * built. In live mode it renders on the account's custom domain.
     */
    createPortalSession(stripeCustomerId: string, returnUrl: string): Promise<string>;
    /**
     * The subscription the billing page is about: the newest one still alive, so a resubscribe wins
     * over the subscription it replaced. Dead ones are excluded — the page should say "no
     * subscription" rather than show a corpse.
     *
     * `data.items.data.price.product` is five levels deep and Stripe expands at most four, so the
     * product name is resolved separately in toSubscription().
     */
    private findCurrentSubscription;
    private requireSubscriptionObject;
    private toSubscription;
    /**
     * The display name of a price's product.
     *
     * Subscription payloads carry `price.product` as a bare id — it sits one level below Stripe's
     * four-level expand ceiling — so it is fetched here and memoised. Product names change rarely and
     * the cache lives only as long as the request handler's service instance.
     */
    private productNameFor;
    private readonly productNames;
    private toPlan;
    private get;
    /**
     * `idempotencyKey` makes a retried POST safe. Without it, a network blip on a plan change can
     * leave the caller unsure whether the switch happened, and a retry would apply it twice — with a
     * proration invoice each time. Stripe replays the original response instead when the key repeats.
     */
    private post;
    private request;
}
