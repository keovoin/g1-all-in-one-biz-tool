"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNameFromEmail = extractNameFromEmail;
const uc_first_1 = require("./uc-first");
/**
 * Extracts the name part of an email address and capitalizes the first letter.
 *
 * @param email - The email address to extract the name from.
 * @returns The extracted name with the first letter capitalized, or an empty string if no valid name is found.
 *
 * @example
 * ```typescript
 * extractNameFromEmail("johndoe@example.com"); // Output: "Johndoe"
 * extractNameFromEmail("user123@domain.com");  // Output: "User123"
 * extractNameFromEmail("");                    // Output: ""
 * ```
 */
function extractNameFromEmail(email) {
    if (email) {
        const namePart = email.substring(0, email.lastIndexOf('@'));
        return (0, uc_first_1.ucFirst)(namePart);
    }
    return '';
}
//# sourceMappingURL=extract-name-from-email.js.map