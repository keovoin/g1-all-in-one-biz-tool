import { IOAuthClient, IOAuthClientWithSecret } from '@gauzy/contracts';
import { OAuthClient } from '../oauth-client.entity';
export declare class OAuthClientResponseDTO implements Partial<IOAuthClient> {
    id?: string;
    clientId: string;
    name: string;
    description?: string | null;
    clientType: OAuthClient['clientType'];
    redirectUris: string[];
    allowedScopes: string[];
    allowedGrantTypes: OAuthClient['allowedGrantTypes'];
    pkceRequired: boolean;
    accessTokenTtl: number;
    refreshTokenTtl: number;
    isActive?: boolean;
    tenantId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    static fromEntity(entity: OAuthClient): OAuthClientResponseDTO;
}
export declare class OAuthClientWithSecretResponseDTO extends OAuthClientResponseDTO implements Partial<IOAuthClientWithSecret> {
    clientSecret: string;
    static fromEntityWithSecret(entity: OAuthClient, plaintextSecret: string): OAuthClientWithSecretResponseDTO;
}
