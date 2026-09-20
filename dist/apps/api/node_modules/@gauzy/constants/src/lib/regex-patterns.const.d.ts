/**
 * Shared regex patterns used across the application for validation.
 * Single source of truth — all packages should import from here.
 */
export declare const patterns: {
    websiteUrl: RegExp;
    imageUrl: RegExp;
    email: RegExp;
    host: RegExp;
    passwordNoSpaceEdges: RegExp;
    strongPassword: RegExp;
};
