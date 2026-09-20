import { IDeal, IPipelineStage, IOrganizationContact, ID } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class Deal extends TenantOrganizationBaseEntity implements IDeal {
    /**
     * The title of the deal.
     */
    title: string;
    /**
     * The probability of the deal.
     */
    probability: number;
    /**
     * The pipeline stage associated with this deal.
     */
    stage: IPipelineStage;
    /**
     * The ID for the associated pipeline stage.
     */
    stageId: ID;
    /**
     * The associated client (OrganizationContact) for the deal.
     */
    client?: IOrganizationContact;
    /**
     * The ID of the associated client (OrganizationContact) for the deal.
     */
    clientId?: ID;
}
