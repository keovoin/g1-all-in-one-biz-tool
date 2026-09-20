import { IActivity } from '@gauzy/contracts';
import { ActivityService } from './activity.service';
import { ActivityMapService } from './activity.map.service';
import { BulkActivityInputDTO } from './dto/bulk-activities-input.dto';
import { ActivityQueryDTO } from './dto';
export declare class ActivityController {
    private readonly activityService;
    private readonly activityMapService;
    constructor(activityService: ActivityService, activityMapService: ActivityMapService);
    /**
     * Retrieves a paginated list of activities based on the provided query parameters.
     *
     * @param options - The query parameters for fetching activities, including pagination options.
     * @returns A promise resolving to a paginated list of activities.
     */
    getActivities(options: ActivityQueryDTO): Promise<IActivity[]>;
    /**
     * Retrieves daily activities based on the provided query parameters.
     *
     * @param options - The query parameters for fetching daily activities.
     * @returns A promise resolving to a list of daily activities.
     */
    getDailyActivities(options: ActivityQueryDTO): Promise<import("@gauzy/contracts").IDailyActivity[]>;
    /**
     * Retrieves a report of daily activities based on the provided query parameters.
     *
     * @param options - The query parameters for fetching the daily activities report, including grouping options.
     * @returns A promise resolving to a grouped report of daily activities.
     */
    getDailyActivitiesReport(options: ActivityQueryDTO): Promise<IActivity[]>;
    /**
     * Saves multiple activities in bulk.
     *
     * @param entities - The list of activities to be saved in bulk.
     * @returns A promise resolving when the bulk save is complete.
     */
    bulkSaveActivities(entities: BulkActivityInputDTO): Promise<any>;
}
