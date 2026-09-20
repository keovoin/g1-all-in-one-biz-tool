import { IOAuthClientCreateInput, OAuthClientType, OAuthGrantType } from '@gauzy/contracts';
export declare class CreateOAuthClientDTO implements IOAuthClientCreateInput {
    name: string;
    description?: string | null;
    clientType?: OAuthClientType;
    redirectUris: string[];
    allowedScopes?: string[];
    allowedGrantTypes?: OAuthGrantType[];
    pkceRequired?: boolean;
    accessTokenTtl?: number;
    refreshTokenTtl?: number;
}
