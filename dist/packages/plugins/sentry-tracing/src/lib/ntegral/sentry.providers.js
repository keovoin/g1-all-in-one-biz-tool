"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSentryProviders = createSentryProviders;
const sentry_constants_1 = require("./sentry.constants");
const sentry_service_1 = require("./sentry.service");
/**
 * Creates a provider for SentryService using the provided options.
 * @param {SentryModuleOptions} options - Options for configuring the Sentry module.
 * @returns {Provider} A provider for SentryService.
 */
function createSentryProviders(options) {
    return {
        provide: sentry_constants_1.SENTRY_TOKEN,
        useValue: new sentry_service_1.SentryService(options),
    };
}
//# sourceMappingURL=sentry.providers.js.map