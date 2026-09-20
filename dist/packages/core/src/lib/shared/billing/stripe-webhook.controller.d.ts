import { TypeOrmTenantRepository } from '../../tenant/repository/type-orm-tenant.repository';
import { TypeOrmUserRepository } from '../../user/repository/type-orm-user.repository';
import { StripeSubscriptionService } from './stripe-subscription.service';
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
export declare class StripeWebhookController {
    private readonly stripeSubscriptionService;
    private readonly typeOrmTenantRepository;
    private readonly typeOrmUserRepository;
    private readonly logger;
    constructor(stripeSubscriptionService: StripeSubscriptionService, typeOrmTenantRepository: TypeOrmTenantRepository, typeOrmUserRepository: TypeOrmUserRepository);
    handle(request: RawBodyRequest): Promise<{
        received: true;
    }>;
    /**
     * React to the handful of events that can change which customer a tenant bills through.
     *
     * Everything else — status transitions, invoice payments — is read live by the billing pages, so
     * mirroring it into our database would only create a second copy to keep in sync.
     */
    private apply;
}
interface RawBodyRequest {
    headers: Record<string, string | string[] | undefined>;
    rawBody?: Buffer;
}
export {};
