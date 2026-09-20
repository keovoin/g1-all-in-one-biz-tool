"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Current Log Levels
 *
 * @enum {number}
 */
var LogLevel;
(function (LogLevel) {
    /**
     * The application is in an emergency state.
     */
    LogLevel[LogLevel["EMERGENCY"] = 0] = "EMERGENCY";
    /**
     * The application owners need to be alerted.
     */
    LogLevel[LogLevel["ALERT"] = 1] = "ALERT";
    /**
     * The application is in a critical state.
     */
    LogLevel[LogLevel["CRITICAL"] = 2] = "CRITICAL";
    /**
     * A serious problem occurred while processing the current operation. Such a message usually requires the user to interact with the application or research the problem in order to find the cause and resolve it.
     */
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    /**
     *  Such messages are reported when something unusual happened that isn’t critical to process the current operation (and the application in general), but would be useful to review to decide if it should be resolved.
     */
    LogLevel[LogLevel["WARNING"] = 4] = "WARNING";
    /**
     * Notice messages are usually used for developers to notice application state.
     */
    LogLevel[LogLevel["NOTICE"] = 5] = "NOTICE";
    /**
     * Informative messages are usually used for reporting significant application progress and stages. Informative messages should not be reported too frequently because they can quickly become “noise.”
     */
    LogLevel[LogLevel["INFO"] = 6] = "INFO";
    /**
     * Used for debugging messages with extended information about application processing. Such messages usually report calls of important functions along with results they return and values of specific variables, or parameters.
     */
    LogLevel[LogLevel["DEBUG"] = 7] = "DEBUG";
})(LogLevel || (LogLevel = {}));
exports.default = LogLevel;
//# sourceMappingURL=logger.js.map