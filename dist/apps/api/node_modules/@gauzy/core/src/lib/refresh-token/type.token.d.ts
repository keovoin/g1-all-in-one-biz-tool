import { JwtPayload } from 'jsonwebtoken';
export declare const REFRESH_TOKEN_TYPE = "REFRESH_TOKEN_TYPE";
export declare const REFRESH_TOKEN: symbol & {
    readonly __token?: "RefreshTokenServiceToken";
};
export declare const JWT_REFRESH_TOKEN: symbol & {
    readonly __token?: "JwtRefreshToken";
};
export interface IRefreshTokenMetadata extends JwtPayload {
    /** Client identify */
    clientId?: string;
    /** User agent */
    userAgent?: string;
    /** IP address */
    ipAddress?: string;
    /** Id */
    id?: string;
    /** Email */
    email?: string;
    /** TenantId */
    tenantId?: string;
    /** Organization Id */
    organizationId?: string;
    /** Role */
    role?: string;
}
