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
export declare function extractNameFromEmail(email: string): string;
