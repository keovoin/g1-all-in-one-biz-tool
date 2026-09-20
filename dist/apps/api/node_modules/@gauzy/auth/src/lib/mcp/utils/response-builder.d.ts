/**
 * Response Builder
 *
 * Standardized response building utility following KISS principle
 * Ensures consistent response formats across all endpoints
 */
import { Response } from 'express';
import { SecurityLogger } from './security-logger';
import { ClientRegistrationResponse, IntrospectionResponse, JWKSResponse, ResourceMetadata, ServerMetadata, TokenResponse, UserInfoResponse } from '../interfaces/interfaces';
export declare class ResponseBuilder {
    private securityLogger;
    constructor(logger?: SecurityLogger);
    /**
     * Send OAuth 2.0 token response with proper headers
     */
    sendTokenResponse(res: Response, tokenData: TokenResponse): void;
    /**
     * Send token introspection response
     */
    sendIntrospectionResponse(res: Response, introspectionData: IntrospectionResponse): void;
    /**
     * Send successful authorization redirect
     */
    sendAuthorizationRedirect(res: Response, redirectUri: string, code: string, state?: string): void;
    /**
     * Send JWKS response
     */
    sendJwksResponse(res: Response, jwks: JWKSResponse): void;
    /**
     * Send OAuth 2.0 server metadata
     */
    sendServerMetadata(res: Response, metadata: ServerMetadata): void;
    /**
     * Send protected resource metadata (RFC 9728)
     */
    sendResourceMetadata(res: Response, metadata: ResourceMetadata): void;
    /**
     * Send user info response (OpenID Connect)
     */
    sendUserInfoResponse(res: Response, userInfo: UserInfoResponse): void;
    /**
     * Send client registration response
     */
    sendClientRegistrationResponse(res: Response, clientData: ClientRegistrationResponse): void;
    /**
     * Send success response with optional data
     */
    sendSuccess<T>(res: Response, data?: T, statusCode?: number): void;
    /**
     * Send HTML response (for login/consent pages)
     */
    sendHtml(res: Response, html: string): void;
    /**
     * Set security headers for all responses
     */
    static setSecurityHeaders(res: Response): void;
}
