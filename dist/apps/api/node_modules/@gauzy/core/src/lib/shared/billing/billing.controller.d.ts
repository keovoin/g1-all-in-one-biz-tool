import { TypeOrmTenantRepository } from '../../tenant/repository/type-orm-tenant.repository';
import { TenantService } from '../../tenant/tenant.service';
import { BillingInvoice, BillingPaymentMethod, BillingPlan, BillingService, BillingSubscription } from './billing.service';
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
export declare class BillingController {
    private readonly billingService;
    private readonly typeOrmTenantRepository;
    private readonly tenantService;
    constructor(billingService: BillingService, typeOrmTenantRepository: TypeOrmTenantRepository, tenantService: TenantService);
    /**
     * Whether this deployment does billing at all. Public to any signed-in user, because the UI has
     * to decide whether to render a billing section before it knows anything else.
     */
    config(): Promise<{
        enabled: boolean;
        mode: 'live' | 'test' | 'disabled';
    }>;
    subscription(): Promise<BillingSubscription | null>;
    plans(): Promise<BillingPlan[]>;
    changePlan(body: {
        lookupKey?: string;
    }): Promise<BillingSubscription>;
    cancel(): Promise<BillingSubscription>;
    resume(): Promise<BillingSubscription>;
    invoices(): Promise<BillingInvoice[]>;
    paymentMethod(): Promise<BillingPaymentMethod | null>;
    /**
     * Hand off to Stripe's customer portal — the second supported management path.
     *
     * `returnUrl` comes from the caller, so it is restricted to the deployment's own web app: an
     * open redirect here would let a crafted link bounce a signed-in admin anywhere after a
     * legitimate-looking Stripe visit.
     */
    portal(body: {
        returnUrl?: string;
    }): Promise<{
        url: string;
    }>;
    private requireBillingEnabled;
    /**
     * The Stripe customer for the tenant making this request.
     *
     * Resolved from `RequestContext`, never from user input — see the class comment.
     */
    private requireCustomerId;
    /**
     * Only same-origin return URLs.
     *
     * There is no hardcoded fallback on purpose. Defaulting to `https://app.gauzy.co` would send a
     * self-hosted operator's own users to a domain that operator does not control — so if
     * `CLIENT_BASE_URL` is not configured, this refuses rather than guesses.
     */
    private safeReturnUrl;
}
