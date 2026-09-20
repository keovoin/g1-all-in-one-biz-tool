"use strict";
var AppBootstrapLogger_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppBootstrapLogger = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let AppBootstrapLogger = AppBootstrapLogger_1 = class AppBootstrapLogger {
    constructor() {
        this.logger = new common_1.Logger(AppBootstrapLogger_1.name);
        this.startTime = Date.now(); // Using Date.now() instead of performance.now()
    }
    /**
     * Logs the total startup time when the application finishes bootstrapping.
     * This method calculates the duration from the recorded start time and logs the result
     * in a human-readable format (minutes and seconds).
     */
    onApplicationBootstrap() {
        const totalTimeMs = Date.now() - this.startTime; // Calculate difference in milliseconds
        const minutes = Math.floor(totalTimeMs / 60000); // Convert milliseconds to minutes
        const seconds = ((totalTimeMs % 60000) / 1000).toFixed(2); // Convert remaining milliseconds to seconds
        this.logger.log(`Application started in ${minutes}m ${seconds}s`);
    }
};
exports.AppBootstrapLogger = AppBootstrapLogger;
exports.AppBootstrapLogger = AppBootstrapLogger = AppBootstrapLogger_1 = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppBootstrapLogger);
//# sourceMappingURL=app-bootstrap-logger.js.map