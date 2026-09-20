import { IEventHandler } from '@nestjs/cqrs';
import { ActivityLogEvent } from '../activity-log.event';
import { ActivityLogService } from '../../activity-log.service';
export declare class ActivityLogEventHandler implements IEventHandler<ActivityLogEvent> {
    readonly activityLogService: ActivityLogService;
    constructor(activityLogService: ActivityLogService);
    /**
     * Handles the activity log event by creating a new activity log entry using the provided input data.
     *
     * @param event - The activity log event containing the input data required to create the log entry.
     * @returns A promise that resolves with the created activity log entry.
     *
     */
    handle(event: ActivityLogEvent): Promise<import("dist/packages/contracts/src").IActivityLog>;
}
