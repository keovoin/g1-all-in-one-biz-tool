"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePosthogOptions = void 0;
/**
 * Parses and validates PostHog options
 * @param options Raw PostHog options
 * @returns Normalized PostHog options
 */
const parsePosthogOptions = (options) => {
    // Validate required options
    if (!options.apiKey) {
        throw new Error('PostHog API key is required');
    }
    // Validate numeric values
    const flushAt = options.flushAt ?? 20;
    if (flushAt <= 0) {
        throw new Error('flushAt must be a positive number');
    }
    const flushInterval = options.flushInterval ?? 10000;
    if (flushInterval <= 0) {
        throw new Error('flushInterval must be a positive number');
    }
    return {
        apiKey: options.apiKey,
        apiHost: options.apiHost ?? 'https://app.posthog.com',
        enableErrorTracking: options.enableErrorTracking ?? true,
        flushAt,
        flushInterval,
        personalApiKey: options.personalApiKey,
        autocapture: options.autocapture ?? false,
        mock: options.mock ?? false
    };
};
exports.parsePosthogOptions = parsePosthogOptions;
//# sourceMappingURL=posthog.interfaces.js.map