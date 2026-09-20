/**
 * Get the list of default user emails that should be protected from deletion in demo environment
 * These users are essential for demo functionality and should always be available
 *
 * @returns Array of protected user emails
 */
export declare function getDefaultProtectedUserEmails(): string[];
/**
 * Check if a user email is a default protected user
 *
 * @param email - The user email to check
 * @returns true if the email is in the protected list
 */
export declare function isDefaultProtectedUser(email: string): boolean;
/**
 * Validates if a user can be deleted in the current environment.
 * Throws ForbiddenException if user is protected in demo mode.
 *
 * @param email - The user email to validate
 * @throws ForbiddenException if user is protected in demo
 */
export declare function validateUserDeletion(email: string): void;
