import { StatsService } from './stats.service';
import { GlobalStats } from './stats.types';
export declare class StatsController {
    private readonly _statsService;
    constructor(_statsService: StatsService);
    /**
     * Fetches and returns the global statistics from the StatsService.
     * Logs the statistics for monitoring purposes.
     *
     * @returns {Promise<GlobalStats>} - A promise that resolves to the global stats
     * @throws {Error} - Throws an error if there is an issue fetching the stats
     */
    getGlobalStats(): Promise<GlobalStats>;
}
