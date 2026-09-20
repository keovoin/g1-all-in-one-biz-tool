import { PluginBillingPeriod } from '@gauzy/contracts';
import { IPluginBillingCreateInput } from '../../shared/models/plugin-billing.model';
/**
 * Factory for creating plugin billing records
 * Implements Factory Pattern to encapsulate complex billing creation logic
 *
 * Billing Calculation Rules:
 * 1. Initial Billing: Base Price - Discount + Setup Fee (one-time charges)
 * 2. Renewal Billing: Base Price ONLY (no discount, no setup fee)
 * 3. Upgrade Billing: Prorated amount based on price difference
 *
 * Discount Application:
 * - Applied ONLY to initial billing as a one-time promotional discount
 * - Discount amount = Base Price × (Discount % / 100)
 * - Effective Price = Base Price - Discount Amount
 *
 * Setup Fee:
 * - Only included in INITIAL billing
 * - NOT included in renewals or recurring charges
 *
 * Total Calculation:
 * - Initial: (Base Price - Discount) + Setup Fee = Total
 * - Renewal: Base Price = Total (full price, no discounts)
 */
export declare class PluginBillingFactory {
    private readonly logger;
    /**
     * Creates a billing record from input data with business logic applied
     * @param input - The billing creation input
     * @returns Billing data ready for persistence
     */
    createFromInput(input: IPluginBillingCreateInput): Promise<IPluginBillingCreateInput>;
    /**
     * Creates a billing record for a subscription renewal
     * Renewals use the FULL base price with NO discounts or setup fees
     * @param subscriptionId - The subscription ID
     * @param plan - The subscription plan
     * @param tenantId - The tenant ID
     * @param organizationId - The organization ID (optional)
     * @returns Billing data for renewal
     */
    createForRenewal(subscriptionId: string, plan: any, tenantId?: string, organizationId?: string): Promise<IPluginBillingCreateInput>;
    /**
     * Creates a billing record for a subscription upgrade
     * @param subscriptionId - The subscription ID
     * @param proratedAmount - The prorated upgrade amount
     * @param billingPeriod - The billing period
     * @returns Billing data for upgrade
     */
    createForUpgrade(subscriptionId: string, proratedAmount: number, billingPeriod: PluginBillingPeriod, tenantId?: string, organizationId?: string): Promise<IPluginBillingCreateInput>;
    /**
     * Creates an initial billing record for a new subscription
     * Calculates total amount including setup fee and discounts
     * @param subscriptionId - The subscription ID
     * @param plan - The subscription plan with pricing details
     * @param hasTrial - Whether the subscription has a trial period
     * @param tenantId - The tenant ID
     * @param organizationId - The organization ID (optional)
     * @returns Billing data for initial subscription
     */
    createInitialBilling(subscriptionId: string, plan: any, hasTrial?: boolean, tenantId?: string, organizationId?: string): Promise<IPluginBillingCreateInput>;
    /**
     * Calculate billing amount with setup fee, discounts, and other options
     * NOTE: This is only used for INITIAL billing. Renewals use full base price.
     * @param plan - The subscription plan
     * @param includeSetupFee - Whether to include setup fee (typically only for initial billing)
     * @returns Calculated billing amounts and breakdown
     */
    private calculateBillingAmount;
    /**
     * Calculates the billing period end date based on start date and period
     * @param startDate - The billing period start date
     * @param period - The billing period
     * @returns The calculated end date
     */
    private calculateBillingPeriodEnd;
    /**
     * Helper to add days to a date
     * @param date - The base date
     * @param days - Number of days to add
     * @returns New date with added days
     */
    private addDaysToDate;
}
