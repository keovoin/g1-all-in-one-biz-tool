/**
 * Security utilities for sanitizing sensitive information and preventing information disclosure
 */
/**
 * Sanitize error message to prevent information disclosure
 * Removes sensitive information like file paths, internal details, etc.
 */
export declare function sanitizeErrorMessage(error: unknown): string;
/**
 * Sanitize object for logging, removing sensitive fields
 */
export declare function sanitizeForLogging(obj: any): any;
/**
 * Check if an error is safe to log in production
 */
export declare function isSafeToLogError(error: unknown): boolean;
/**
 * Create a safe error response for API endpoints
 */
export declare function createSafeErrorResponse(error: unknown, includeDetails?: boolean): {
    error: string;
    details?: string;
};
