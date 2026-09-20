export declare enum EntitlementResult {
    /** A matching customer holds an entitling subscription. */
    ENTITLED = "entitled",
    /** Stripe answered, and this email has no entitling subscription. */
    NOT_ENTITLED = "not_entitled",
    /** Stripe could not be reached or errored. Caller decides; this is never a hard "no". */
    UNKNOWN = "unknown"
}
export declare class StripeSubscriptionService {
    private readonly logger;
    /**
     * The Stripe key this deployment may actually use, or undefined if it must not bill at all.
     *
     * Read straight from the process environment rather than `@gauzy/config`, because the *absence*
     * of this value is the feature switch: nothing else in the platform should have to know that
     * billing exists, and a fork with no Stripe account must behave exactly as it does today.
     *
     * Two refusals are enforced here rather than left to deployment discipline, because the cost of
     * getting either wrong is charging somebody real money from an environment that should not:
     *
     *  - **A demo deployment never bills.** `DEMO=true` disables billing outright, even if a key is
     *    present. demo.gauzy.co resets daily and is handed round freely; nothing there should reach a
     *    payment provider.
     *  - **A live key needs a second, deliberate opt-in.** Any live credential — `sk_live_` *or* the
     *    restricted `rk_live_` an operator might reasonably prefer — is honoured only when
     *    `STRIPE_LIVE_MODE=true` is also set. Copying a production secret bundle onto staging is an
     *    ordinary mistake; silently taking real payments from stage.gauzy.co because of it is not an
     *    ordinary consequence. Staging uses a test key and needs no opt-in.
     */
    private get secretKey();
    /**
     * The key any Stripe call must use, or throws if this deployment must not bill.
     *
     * Exists so that nothing reads `process.env.STRIPE_SECRET_KEY` for itself. Every refusal encoded
     * above — demo deployments, and live keys without an explicit opt-in — is only worth anything if
     * it is the single way a credential can be obtained; a second service reading the environment
     * directly silently reinstates exactly the behaviour those rules exist to prevent.
     */
    requireKey(): string;
    /** Which Stripe mode this deployment is operating in — surfaced so the UI can say so. */
    get mode(): 'live' | 'test' | 'disabled';
    private readonly warned;
    /** Loud, but once per reason — this is read on every request that touches billing. */
    private warnOnce;
    /**
     * Whether registration should be gated on a Stripe subscription at all.
     *
     * False on every self-hosted install that has not configured Stripe, which is the default — and
     * the reason this returns a plain boolean rather than throwing.
     */
    isBillingEnforced(): boolean;
    /**
     * Look up whether `email` holds a subscription that entitles them to register.
     *
     * Returns UNKNOWN rather than NOT_ENTITLED when Stripe cannot be reached. Callers are expected to
     * let UNKNOWN through: the card was already captured during checkout, so someone arriving at
     * registration has almost certainly just paid, and making signup unavailable whenever Stripe has
     * a bad minute is a far worse failure than briefly admitting someone who slipped past.
     */
    getEntitlement(email: string): Promise<EntitlementResult>;
    /**
     * The Stripe customer behind an entitling subscription for `email`, or null.
     *
     * Used when a tenant is first created, to record the link between that tenant and its billing
     * account. From then on the stored id is authoritative and the email is never consulted again —
     * an email can be changed, and Stripe permits several customers to share one.
     *
     * Returns null rather than throwing when Stripe is unreachable: failing to record the link must
     * not fail the onboarding around it.
     */
    findCustomerIdForEmail(email: string): Promise<string | null>;
    /**
     * The email Stripe holds for a customer, or null.
     *
     * Needed because most events identify the customer by id alone. A Subscription object carries no
     * email field whatsoever — verified against a real `customer.subscription.created` payload — so a
     * receiver that reads `customer_email` off the event finds nothing and silently does nothing.
     * Only `checkout.session.completed` includes the address inline.
     *
     * Returns null rather than throwing: this resolves a link, and failing to resolve one must never
     * escalate into failing the operation that triggered it.
     */
    getCustomerEmail(customerId: string): Promise<string | null>;
    /**
     * Shared lookup: the first customer sharing this email that holds an entitling subscription.
     *
     * Throws on transport or API failure so each caller can decide what that means for it.
     *
     * Three constraints shape this, and all three exist because it runs inside a request to the
     * public `POST /auth/register`:
     *
     *  - **Bounded work.** Stripe's `email` filter can return many customers, and each needs its own
     *    subscription lookup. Left unbounded that is one HTTP call per customer on a request thread,
     *    so the number examined is capped and the whole operation shares a single deadline.
     *  - **Paginated, not truncated.** A single page would silently conclude NOT_ENTITLED for a paying
     *    customer whose record happened to sit on page two — the worst possible way to be wrong here.
     *  - **Case-tolerant.** Stripe's `email` filter is an exact match, so an address stored with
     *    different casing than the one typed at registration would not be found by either spelling
     *    alone.
     */
    private findEntitlingCustomerId;
    /** Whether this customer holds any subscription in an entitling status. */
    private hasEntitlingSubscription;
    /**
     * Walk every page of a Stripe list endpoint.
     *
     * Reading only the first page is the failure that matters here: it turns "your subscription is on
     * page two" into "you have no subscription", and refuses a paying customer.
     *
     * Running out of time **throws** rather than ending the iteration quietly. Returning early would
     * be indistinguishable from a genuinely exhausted list, and the caller would read it as "this
     * person has nothing" — reintroducing exactly the wrong answer the pagination exists to prevent.
     * As a thrown error it becomes UNKNOWN instead, which lets the registration through.
     */
    private paginate;
    /**
     * GET a Stripe endpoint, with a short timeout so a hanging call cannot stall registration.
     */
    private request;
}
