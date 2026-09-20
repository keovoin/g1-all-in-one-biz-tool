import { ITenant, IOrganization, IRolePermission, IFeatureOrganization, ID, IImageAsset } from '@gauzy/contracts';
import { BaseEntity } from '../core/entities/internal';
export declare class Tenant extends BaseEntity implements ITenant {
    name?: string;
    logo?: string;
    /**
     * Stripe customer this tenant bills through, on hosted deployments.
     *
     * Indexed because the billing endpoints and the Stripe webhook both look a tenant up by it.
     * Null on every self-hosted install — nothing in the platform requires it to be set.
     */
    stripeCustomerId?: string;
    /**
     * Standard work hours per day for the tenant.
     */
    standardWorkHoursPerDay?: number;
    /**
     * ImageAsset
     */
    image?: IImageAsset;
    imageId?: ID;
    organizations?: IOrganization[];
    rolePermissions?: IRolePermission[];
    /**
     * Array of feature organizations associated with the entity.
     */
    featureOrganizations?: IFeatureOrganization[];
}
