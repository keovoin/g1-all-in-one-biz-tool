"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const common_2 = require("@gauzy/common");
const stats_service_1 = require("./stats.service");
const stats_guard_1 = require("./stats.guard");
let StatsController = class StatsController {
    constructor(_statsService) {
        this._statsService = _statsService;
    }
    /**
     * Fetches and returns the global statistics from the StatsService.
     * Logs the statistics for monitoring purposes.
     *
     * @returns {Promise<GlobalStats>} - A promise that resolves to the global stats
     * @throws {Error} - Throws an error if there is an issue fetching the stats
     */
    async getGlobalStats() {
        try {
            // Fetch the global statistics from the StatsService
            const stats = await this._statsService.getGlobalStats();
            // Log the global stats for debugging and monitoring
            console.log(chalk.green(`Global Stats: ${JSON.stringify(stats)}`));
            // Return the fetched global statistics
            return stats;
        }
        catch (error) {
            // Log the error and rethrow to handle it at a higher level (e.g., middleware or global exception filter)
            console.error('Error fetching global stats:', error.stack);
            // Throw a custom error message
            throw new Error(`Failed to retrieve global statistics: ${error.message}`);
        }
    }
};
exports.StatsController = StatsController;
tslib_1.__decorate([
    (0, common_1.UseGuards)(stats_guard_1.StatsGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_OPEN_STATS),
    (0, common_1.Get)('/global'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], StatsController.prototype, "getGlobalStats", null);
exports.StatsController = StatsController = tslib_1.__decorate([
    (0, common_1.Controller)('/stats'),
    (0, common_2.Public)(),
    tslib_1.__metadata("design:paramtypes", [stats_service_1.StatsService])
], StatsController);
//# sourceMappingURL=stats.controller.js.map