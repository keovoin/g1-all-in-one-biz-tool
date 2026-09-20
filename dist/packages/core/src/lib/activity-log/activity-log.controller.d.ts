import { IActivityLog, IPagination } from '@gauzy/contracts';
import { GetActivityLogsDTO } from './dto/get-activity-logs.dto';
import { ActivityLogService } from './activity-log.service';
export declare class ActivityLogController {
    readonly _activityLogService: ActivityLogService;
    constructor(_activityLogService: ActivityLogService);
    /**
     * Retrieves activity logs based on query parameters.
     * Supports filtering, pagination, sorting, and ordering.
     *
     * @param query Query parameters for filtering, pagination, and ordering.
     * @returns A list of activity logs.
     */
    getActivityLogs(query: GetActivityLogsDTO): Promise<IPagination<IActivityLog>>;
}
