import { IFeature, IFeatureOrganization } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class FeatureOrganization extends TenantOrganizationBaseEntity implements IFeatureOrganization {
    isEnabled: boolean;
    /**
     * Feature
     */
    feature: IFeature;
    featureId: IFeature['id'];
}
