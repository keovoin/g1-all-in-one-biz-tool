import { IEstimateEmail } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class EstimateEmail extends TenantOrganizationBaseEntity implements IEstimateEmail {
    /** Bearer token for the public estimate view; signed with the application JWT secret. */
    token?: string;
    email?: string;
    expireDate?: Date;
    convertAcceptedEstimates?: boolean;
}
