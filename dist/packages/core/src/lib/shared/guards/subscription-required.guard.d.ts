import { CanActivate, ExecutionContext } from '@nestjs/common';
import { StripeSubscriptionService } from '../billing/stripe-subscription.service';
/**
 * Requires the registering email to hold a Stripe subscription.
 *
 * This exists because signup on the hosted deployments now begins at checkout: the visitor picks a
 * plan, Stripe captures a card, and only then are they returned to the register form. Someone who
 * arrives at `/auth/register` directly has skipped that, so they are sent to checkout instead.
 *
 * **Inert unless STRIPE_SECRET_KEY is set.** That is the whole contract for self-hosters: clone the
 * repo, set no Stripe key, and registration behaves exactly as it always has — no Stripe call is
 * made, no subscription is required, and this guard returns true before doing anything else.
 *
 * Runs alongside RegisterAuthorizationGuard, which handles a different question (whether privileged
 * fields in the body are allowed). Neither subsumes the other.
 */
export declare class SubscriptionRequiredGuard implements CanActivate {
    private readonly stripeSubscriptionService;
    constructor(stripeSubscriptionService: StripeSubscriptionService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
