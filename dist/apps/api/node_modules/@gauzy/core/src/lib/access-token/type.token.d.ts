import { JwtPayload } from 'jsonwebtoken';
export declare const ACCESS_TOKEN_TYPE = "ACCESS_TOKEN_TYPE";
export declare const ACCESS_TOKEN: symbol & {
    readonly __token?: "AccessTokenServiceToken";
};
export declare const JWT_ACCESS_TOKEN: symbol & {
    readonly __token?: "JwtAccessToken";
};
export interface IAccessTokenMetadata extends JwtPayload {
    /** Client identifier */
    clientId?: string;
    /** User agent */
    userAgent?: string;
    /** IP address */
    ipAddress?: string;
    /** User Id */
    id?: string;
    /** Third-party Id (e.g. from social login) */
    thirdPartyId?: string;
    /** TenantId */
    tenantId?: string;
    /** Organization Id */
    organizationId?: string;
    /** Role */
    role?: string;
    /** Permissions */
    permissions?: string[];
}
