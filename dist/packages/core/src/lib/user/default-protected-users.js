"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultProtectedUserEmails = getDefaultProtectedUserEmails;
exports.isDefaultProtectedUser = isDefaultProtectedUser;
exports.validateUserDeletion = validateUserDeletion;
const config_1 = require("@gauzy/config");
const common_1 = require("@nestjs/common");
/**
 * Get the list of default user emails that should be protected from deletion in demo environment
 * These users are essential for demo functionality and should always be available
 *
 * @returns Array of protected user emails
 */
function getDefaultProtectedUserEmails() {
    // Guard against missing or undefined demo credential config
    if (!config_1.environment.demoCredentialConfig) {
        return [];
    }
    const protectedEmails = [
        // Default Super Admin
        config_1.environment.demoCredentialConfig.superAdminEmail,
        // Default Admin
        config_1.environment.demoCredentialConfig.adminEmail,
        // Default Employee
        config_1.environment.demoCredentialConfig.employeeEmail
    ];
    // Filter out undefined/null values and convert to lowercase for comparison
    return protectedEmails.filter((email) => !!email?.trim()).map((email) => email.trim().toLowerCase());
}
/**
 * Check if a user email is a default protected user
 *
 * @param email - The user email to check
 * @returns true if the email is in the protected list
 */
function isDefaultProtectedUser(email) {
    if (!email) {
        return false;
    }
    const protectedEmails = getDefaultProtectedUserEmails();
    return protectedEmails.includes(email.trim().toLowerCase());
}
/**
 * Validates if a user can be deleted in the current environment.
 * Throws ForbiddenException if user is protected in demo mode.
 *
 * @param email - The user email to validate
 * @throws ForbiddenException if user is protected in demo
 */
function validateUserDeletion(email) {
    if (!!config_1.environment.demo && isDefaultProtectedUser(email)) {
        throw new common_1.ForbiddenException(`Cannot delete default user account "${email}" in demo environment. ` +
            `This account is protected to ensure demo functionality remains available for all visitors.`);
    }
}
//# sourceMappingURL=default-protected-users.js.map