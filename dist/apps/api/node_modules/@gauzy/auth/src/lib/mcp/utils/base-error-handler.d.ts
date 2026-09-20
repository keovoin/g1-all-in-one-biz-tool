/**
 * Base Error Handler
 *
 * Centralized error handling utility following DRY and KISS principles
 * Provides consistent error formatting and logging across the MCP server
 */
import { Response } from 'express';
import { SecurityLogger } from './security-logger';
import { AuthorizationError } from '../interfaces/authorization-config';
export interface StandardError {
    code: string;
    message: string;
    details?: unknown;
    statusCode: number;
}
export declare class BaseErrorHandler {
    private securityLogger;
    constructor(logger?: SecurityLogger);
    /**
     * Handle OAuth 2.0 errors with consistent formatting
     */
    handleOAuthError(res: Response, error: AuthorizationError, statusCode?: number): void;
    /**
     * Handle OAuth redirect errors (for authorization endpoint)
     */
    handleOAuthRedirectError(res: Response, redirectUri: string, error: AuthorizationError['error'], description?: string, errorUri?: string, state?: string, clientId?: string): void;
    /**
     * Handle standard HTTP errors
     */
    handleStandardError(res: Response, error: StandardError): void;
    /**
     * Handle validation errors
     */
    handleValidationError(res: Response, field: string, message: string, statusCode?: number): void;
    /**
     * Handle authentication errors with proper WWW-Authenticate header
     */
    handleAuthError(res: Response, error: AuthorizationError, resourceMetadataUrl?: string): void;
    /**
     * Set no-store cache headers and optionally Content-Type and Vary headers
     */
    private setNoStoreJsonHeaders;
    /**
     * Set basic no-store cache headers (without Content-Type)
     */
    private setNoStoreHeaders;
    /**
     * Format WWW-Authenticate header according to RFC 9728
     */
    private formatWWWAuthenticateHeader;
    /**
     * Create standard authorization error objects
     */
    static createAuthError(error: AuthorizationError['error'], description?: string, scope?: string, errorUri?: string): AuthorizationError;
}
