import { IEstimateEmailFindInput } from '@gauzy/contracts';
/**
 * Allowed relations for the estimate-email validation endpoint.
 *
 * Only relations whose columns are explicitly constrained by the service's
 * `select` clause are permitted.  Any relation not in this enum will be
 * rejected by class-validator.
 */
export declare enum EstimateEmailRelationEnum {
    'tenant' = "tenant",
    'organization' = "organization"
}
/**
 * Find estimate email request DTO validation
 */
export declare class FindEstimateEmailQueryDTO implements IEstimateEmailFindInput {
    readonly email: string;
    readonly token: string;
    readonly relations: string[];
}
