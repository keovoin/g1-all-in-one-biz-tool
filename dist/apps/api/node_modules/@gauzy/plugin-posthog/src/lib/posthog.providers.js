"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPosthogProviders = createPosthogProviders;
const posthog_constants_1 = require("./posthog.constants");
const posthog_service_1 = require("./posthog.service");
function createPosthogProviders(options) {
    return {
        provide: posthog_constants_1.POSTHOG_TOKEN,
        useFactory: () => new posthog_service_1.PosthogService(options)
    };
}
//# sourceMappingURL=posthog.providers.js.map