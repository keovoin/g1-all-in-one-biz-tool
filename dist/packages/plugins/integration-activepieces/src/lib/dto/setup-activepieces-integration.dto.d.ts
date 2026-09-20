import { TenantOrganizationBaseDTO } from '@gauzy/core';
/**
 * DTO for setting up ActivePieces integration with an API key
 */
export declare class SetupActivepiecesIntegrationDto extends TenantOrganizationBaseDTO {
    readonly apiKey: string;
}
