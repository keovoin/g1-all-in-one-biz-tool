export interface TokenResponse {
    access_token: string;
    token_type: 'Bearer' | 'DPoP' | (string & {});
    expires_in: number;
    refresh_token?: string;
    scope?: string;
    id_token?: string;
}
export interface IntrospectionResponse {
    active: boolean;
    scope?: string;
    client_id?: string;
    username?: string;
    token_type?: string;
    exp?: number;
    iat?: number;
    nbf?: number;
    sub?: string;
    aud?: string | string[];
    iss?: string;
    jti?: string;
}
export interface JWKSKey {
    kty: 'RSA' | 'EC' | 'OKP' | 'oct';
    use?: 'sig' | 'enc';
    key_ops?: Array<'sign' | 'verify' | 'encrypt' | 'decrypt' | 'wrapKey' | 'unwrapKey' | 'deriveKey' | 'deriveBits'>;
    alg?: string;
    kid?: string;
    x5u?: string;
    x5c?: string[];
    x5t?: string;
    'x5t#S256'?: string;
    n?: string;
    e?: string;
    d?: string;
    p?: string;
    q?: string;
    dp?: string;
    dq?: string;
    qi?: string;
    oth?: Array<{
        r?: string;
        d?: string;
        t?: string;
    }>;
    crv?: string;
    x?: string;
    y?: string;
    k?: string;
}
export type PublicJWK = Omit<JWKSKey, 'd' | 'p' | 'q' | 'dp' | 'dq' | 'qi' | 'oth' | 'k'>;
export interface JWKSResponse {
    keys: PublicJWK[];
}
export interface ServerMetadata {
    issuer: string;
    authorization_endpoint?: string;
    token_endpoint?: string;
    jwks_uri?: string;
    registration_endpoint?: string;
    introspection_endpoint?: string;
    userinfo_endpoint?: string;
    scopes_supported?: string[];
    response_types_supported?: string[];
    grant_types_supported?: string[];
    code_challenge_methods_supported?: string[];
    token_endpoint_auth_methods_supported?: string[];
    revocation_endpoint_auth_methods_supported?: string[];
}
export interface ResourceMetadata {
    resource: string;
    authorization_servers?: string[];
}
export interface UserInfoResponse {
    sub: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    nickname?: string;
    preferred_username?: string;
    profile?: string;
    picture?: string;
    website?: string;
    email?: string;
    email_verified?: boolean;
    gender?: string;
    birthdate?: string;
    zoneinfo?: string;
    locale?: string;
    phone_number?: string;
    phone_number_verified?: boolean;
    address?: {
        formatted?: string;
        street_address?: string;
        locality?: string;
        region?: string;
        postal_code?: string;
        country?: string;
    };
    updated_at?: number;
    organization_id?: string;
    tenant_id?: string;
    roles?: string[];
}
export type ClientRegistrationResponse = ({
    client_type: 'confidential';
    client_secret: string;
    client_secret_expires_at?: number;
} & {
    client_id: string;
    client_name: string;
    redirect_uris: string[];
    grant_types: string[];
    response_types: string[];
    scope: string;
    logo_uri?: string;
    client_uri?: string;
    policy_uri?: string;
    tos_uri?: string;
    client_id_issued_at: number;
}) | ({
    client_type: 'public';
    client_secret?: undefined;
    client_secret_expires_at?: undefined;
} & {
    client_id: string;
    client_name: string;
    redirect_uris: string[];
    grant_types: string[];
    response_types: string[];
    scope: string;
    logo_uri?: string;
    client_uri?: string;
    policy_uri?: string;
    tos_uri?: string;
    client_id_issued_at: number;
});
