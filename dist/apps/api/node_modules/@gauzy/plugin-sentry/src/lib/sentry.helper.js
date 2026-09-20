"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptions = void 0;
exports.createDefaultSentryIntegrations = createDefaultSentryIntegrations;
exports.removeDuplicateIntegrations = removeDuplicateIntegrations;
const Sentry = require("@sentry/node");
const config_1 = require("@gauzy/config");
/**
 * Parses and formats Sentry plugin options for configuration.
 * @param config The input configuration options for Sentry plugin.
 * @returns The formatted Sentry configuration options.
 */
const parseOptions = (config) => ({
    dsn: config.dsn, //
    debug: config.debug || false, // Use debug from input config or false as default
    environment: config.environment, //
    release: config.release, //
    logLevels: config.logLevels || [], //
    integrations: config.integrations || [],
    tracesSampleRate: config.tracesSampleRate, //
    profilesSampleRate: config.profilesSampleRate, //
    close: {
        enabled: config.close?.enabled || true, //
        // Time in milliseconds to forcefully quit the application
        timeout: config.close?.timeout || 3000 //
    }
});
exports.parseOptions = parseOptions;
/**
 * Creates an array of Sentry integrations based on the provided environment configuration.
 * @returns {Integration[]} An array of Sentry integrations.
 */
function createDefaultSentryIntegrations() {
    const integrations = [];
    if (config_1.environment.sentry && config_1.environment.sentry.dsn) {
        addHttpTracingIntegration(integrations);
        addPostgresTrackingIntegration(integrations);
        addConsoleIntegration(integrations);
        addGraphQLIntegration(integrations);
        addApolloIntegration(integrations);
        addLocalVariablesIntegration(integrations);
        addRequestDataIntegration(integrations);
    }
    return integrations;
}
/**
 * Add HTTP Tracing integration if enabled.
 * @param integrations The array of Sentry integrations.
 */
function addHttpTracingIntegration(integrations) {
    if (process.env.SENTRY_DSN && process.env.SENTRY_HTTP_TRACING_ENABLED === 'true') {
        integrations.push(Sentry.httpIntegration({ breadcrumbs: true }));
        console.log('Sentry HTTP Tracing Enabled');
    }
}
/**
 * Add Postgres Tracking integration if enabled.
 * @param integrations The array of Sentry integrations.
 */
function addPostgresTrackingIntegration(integrations) {
    if (process.env.SENTRY_DSN &&
        process.env.SENTRY_POSTGRES_TRACKING_ENABLED === 'true' &&
        process.env.DB_TYPE === 'postgres') {
        integrations.push(Sentry.postgresIntegration());
        console.log('Sentry Postgres Tracing Enabled');
    }
}
/**
 * Add Console integration.
 * @param integrations The array of Sentry integrations.
 */
function addConsoleIntegration(integrations) {
    // Only capture console.error and console.warn, not console.log or console.info
    // This prevents info/debug messages from being sent to Sentry
    integrations.push(Sentry.captureConsoleIntegration({
        levels: ['error', 'warn'] // Only capture errors and warnings
    }));
    console.log('Sentry Console Enabled (errors and warnings only)');
}
/**
 * Add GraphQL integration.
 * @param integrations The array of Sentry integrations.
 */
function addGraphQLIntegration(integrations) {
    integrations.push(Sentry.graphqlIntegration());
    console.log('Sentry GraphQL Enabled');
}
/**
 * Add Apollo integration.
 * @param integrations The array of Sentry integrations.
 */
function addApolloIntegration(integrations) {
    // V9 Migration: Apollo integration was removed, using GraphQL integration instead
    // GraphQL integration provides similar functionality for GraphQL tracing
    integrations.push(Sentry.graphqlIntegration());
    console.log('Sentry Apollo integration replaced with GraphQL integration for v9');
}
/**
 * Add Local Variables integration.
 * @param integrations The array of Sentry integrations.
 */
function addLocalVariablesIntegration(integrations) {
    integrations.push(Sentry.localVariablesIntegration({ captureAllExceptions: true }));
    console.log('Sentry Local Variables Enabled');
}
/**
 * Add Request Data integration.
 * @param integrations The array of Sentry integrations.
 */
function addRequestDataIntegration(integrations) {
    integrations.push(Sentry.requestDataIntegration({ include: { ip: true } }));
    console.log('Sentry Request Data Enabled');
}
/**
 * Removes duplicate integrations based on their names.
 * @param {Integration[]} integrations - Array of integrations to process.
 * @returns {Integration[]} Array of unique integrations.
 */
function removeDuplicateIntegrations(integrations) {
    const map = new Set();
    return integrations.reduce((unique, integration) => {
        if (!map.has(integration.name)) {
            map.add(integration.name);
            unique.push(integration);
        }
        return unique;
    }, []);
}
//# sourceMappingURL=sentry.helper.js.map