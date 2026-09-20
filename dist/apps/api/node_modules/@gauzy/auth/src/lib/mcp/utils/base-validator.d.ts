/**
 * Base Validator
 *
 * Centralized validation utilities following DRY principle
 * Provides consistent validation patterns across OAuth 2.0 components
 */
import type { AuthorizeRequest, TokenRequest } from '../server/oauth-authorization-server';
export interface ValidationResult {
    valid: boolean;
    error?: string;
    errorDescription?: string;
}
export declare class BaseValidator {
    /**
     * Validate email format
     */
    static readonly BASE64URL_RE: RegExp;
    static validateEmail(email: string): ValidationResult;
    /**
     * Validate URL format
     */
    static validateUrl(url: string): ValidationResult;
    /**
     * Validate OAuth 2.0 scope format
     */
    static validateScope(scope: string): ValidationResult;
    /**
     * Validate OAuth 2.0 authorize request
     */
    static validateAuthorizeRequest(params: AuthorizeRequest): ValidationResult;
    /**
     * Validate OAuth 2.0 token request
     */
    static validateTokenRequest(params: TokenRequest): ValidationResult;
    /**
     * Validate client credentials
     */
    static validateClientCredentials(clientId: string, clientSecret?: string): ValidationResult;
    /**
     * Sanitize and validate state parameter
     */
    static validateState(state?: string): ValidationResult;
}
