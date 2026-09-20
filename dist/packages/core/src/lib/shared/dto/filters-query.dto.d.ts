import { ITimeLogFilters, TimeLogSourceEnum, TimeLogType } from '@gauzy/contracts';
/**
 * Data Transfer Object for filtering time logs based on source, log type, and activity level.
 * This DTO provides optional filters to refine time log queries.
 */
export declare class FiltersQueryDTO implements ITimeLogFilters {
    /**
     * Filters time logs by their source.
     * Can include multiple sources like Desktop, Web, or Mobile.
     * If not provided, no filtering by source will be applied.
     */
    source: TimeLogSourceEnum[];
    /**
     * Filters time logs by their log type (Manual, Tracked, etc.).
     * Multiple log types can be specified.
     * If not provided, no filtering by log type will be applied.
     */
    logType: TimeLogType[];
    /**
     * Filters time logs by activity level, specifying a range between `start` and `end`.
     * This filter limits logs to a specific activity range (e.g., from 10% to 90% activity).
     * If not provided, no filtering by activity level will be applied.
     */
    activityLevel: {
        start: number;
        end: number;
    };
}
