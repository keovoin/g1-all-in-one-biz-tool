import { Response } from 'express';
import { SocialAuthService } from '../social-auth.service';
interface OAuthAppAuthorizeQuery {
    client_id?: string;
    redirect_uri?: string;
    response_type?: string;
    scope?: string;
    state?: string;
}
interface OAuthAppApproveDto {
    request_id?: string;
}
interface OAuthAppTokenRequestDto {
    grant_type?: string;
    code?: string;
    client_id?: string;
    client_secret?: string;
    redirect_uri?: string;
}
export declare class OAuthAppController {
    private readonly service;
    private readonly logger;
    constructor(service: SocialAuthService);
    /**
     * GET /authorize - Public endpoint.
     * Validates OAuth params, stores pending request in cache,
     * and redirects to the frontend consent page.
     */
    authorize(query: OAuthAppAuthorizeQuery, res: Response): Promise<void>;
    /**
     * GET /authorize/request/:requestId - Authenticated endpoint (JWT required).
     * Returns pending request details for the frontend consent page.
     */
    getAuthorizeRequest(requestId: string): Promise<{
        clientId: string;
        clientName: string;
        clientDescription: string;
        scope: string;
        redirectUri: string;
    }>;
    /**
     * POST /authorize - Authenticated endpoint (JWT required).
     * User approves the authorization request. Generates an authorization code
     * and returns the redirect URL for the third-party app.
     */
    approveAuthorize(body: OAuthAppApproveDto, req: any): Promise<{
        redirect_url: string;
    }>;
    /**
     * POST /token - Public endpoint.
     * Exchanges an authorization code for an access token.
     */
    token(body: OAuthAppTokenRequestDto): Promise<{
        access_token: string;
        token_type: string;
        expires_in: number;
        scope: string;
    }>;
}
export {};
