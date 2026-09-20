import { ICreateActivepiecesIntegrationInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
/**
 * DTO for creating ActivePieces integration connection
 */
export declare class CreateActivepiecesIntegrationDto extends TenantOrganizationBaseDTO implements ICreateActivepiecesIntegrationInput {
    readonly accessToken: string;
    readonly projectId: string;
    readonly connectionName?: string;
}
