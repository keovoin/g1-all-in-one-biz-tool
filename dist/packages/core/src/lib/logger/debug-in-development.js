"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugInDevelopment = debugInDevelopment;
const config_1 = require("@gauzy/config");
/**
 * Emits a DEBUG entry only when the API runs as a development instance (see `isDevelopment`).
 * The message is built lazily, so hot paths never pay for it outside a development runtime.
 * Needed because the application enables every log level at bootstrap, so `logger.debug`
 * alone would still print, and still build its message, everywhere.
 *
 * @param logger - The logger of the calling service
 * @param message - Builds the message; only called when it will be printed
 */
function debugInDevelopment(logger, message) {
    if ((0, config_1.isDevelopment)()) {
        logger.debug?.(message());
    }
}
//# sourceMappingURL=debug-in-development.js.map