"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOctokit = exports.createSmee = exports.createProbot = exports.parseConfig = exports.GITHUB_API_URL = void 0;
const smee_client_1 = require("smee-client");
// GITHUB API URL
exports.GITHUB_API_URL = 'https://api.github.com';
/**
 * Dynamically import getPrivateKey from @probot/get-private-key (ESM module)
 * @param privateKey - The private key string
 * @returns Promise<string> - The processed private key
 */
async function getPrivateKeyAsync(privateKey) {
    try {
        // Dynamic import for ESM module compatibility
        const { getPrivateKey } = await import('@probot/get-private-key');
        return getPrivateKey({
            env: { PRIVATE_KEY: privateKey ? privateKey.replace(/\\n/g, '\n') : '' }
        });
    }
    catch (error) {
        console.error('Error importing @probot/get-private-key:', error);
        // Fallback: return the processed private key directly
        return privateKey ? privateKey.replace(/\\n/g, '\n') : '';
    }
}
/**
 * Parse and restructure Probot configuration into a more organized format.
 * @param config - Probot configuration.
 * @returns Promise<Record<string, any>> - Parsed configuration object.
 */
const parseConfig = async (config) => {
    const privateKey = await getPrivateKeyAsync(config.privateKey);
    return {
        appId: config.appId,
        privateKey,
        webhookSecret: config.webhookSecret,
        ghUrl: config.ghUrl || exports.GITHUB_API_URL,
        webhookProxy: config.webhookProxy,
        webhookPath: config.webhookPath,
        clientId: config.clientId,
        clientSecret: config.clientSecret
    };
};
exports.parseConfig = parseConfig;
/**
 * Create and configure a Probot instance.
 * @param config - Probot configuration.
 * @returns Promise<Probot> - A configured Probot instance.
 */
const createProbot = async (config) => {
    try {
        // Dynamic import for ESM module compatibility
        const { Probot } = await import('probot');
        const parsedConfig = await (0, exports.parseConfig)(config);
        return new Probot({
            ...parsedConfig, // Spread the parsed configuration properties
            // Probot's constructor reads `options.secret` (`webhookSecret: options.secret ||
            // defaultWebhookSecret`), NOT `webhookSecret`. Spreading the parsed config alone therefore
            // dropped the configured secret on the floor and keyed Probot's internal `@octokit/webhooks`
            // instance with its literal default, `"development"` — so anything built on
            // `probot.webhooks.verify` would have validated against a public constant. The receiver in
            // `ProbotDiscovery` verifies the HMAC itself, but the option is corrected here too so the
            // two can never disagree.
            secret: parsedConfig.webhookSecret
        });
    }
    catch (error) {
        console.error('Error importing probot:', error);
        throw error;
    }
};
exports.createProbot = createProbot;
/**
 * Create and configure a SmeeClient instance.
 * @param config - Probot configuration.
 * @returns Promise<SmeeClient> - A configured SmeeClient instance.
 */
const createSmee = async (config) => {
    const parsedConfig = await (0, exports.parseConfig)(config);
    return new smee_client_1.default({
        source: parsedConfig.webhookProxy,
        target: parsedConfig.webhookPath,
        logger: console
    });
};
exports.createSmee = createSmee;
/**
 * Create and configure an Octokit instance for GitHub API requests.
 * @param config - Configuration options for Octokit.
 * @returns Promise<Octokit> - An Octokit instance.
 */
const createOctokit = async (config) => {
    try {
        // Dynamic imports for ESM modules
        const { Octokit } = await import('@octokit/rest');
        const { createAppAuth } = await import('@octokit/auth-app');
        /** Parsed Probot Config */
        const probot = await (0, exports.parseConfig)(config.probot);
        /** return an Octokit instance. */
        return new Octokit({
            authStrategy: createAppAuth,
            baseUrl: probot.ghUrl,
            auth: {
                appId: probot.appId,
                privateKey: probot.privateKey,
                clientId: probot.clientId,
                clientSecret: probot.clientSecret,
                ...config.auth // Include other auth options if needed
            }
        });
    }
    catch (error) {
        console.error('Error importing Octokit modules:', error);
        throw error;
    }
};
exports.createOctokit = createOctokit;
//# sourceMappingURL=probot.helpers.js.map