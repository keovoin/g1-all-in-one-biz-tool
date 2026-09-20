import { IGetTimesheetInput } from '@gauzy/contracts';
import { TimesheetStatus } from '@gauzy/contracts';
import { RelationsQueryDTO, SelectorsQueryDTO } from './../../../../shared/dto';
declare const TimesheetQueryDTO_base: import("@nestjs/common").Type<RelationsQueryDTO & SelectorsQueryDTO>;
/**
 * Get timesheet request DTO validation
 */
export declare class TimesheetQueryDTO extends TimesheetQueryDTO_base implements IGetTimesheetInput {
    /**
     * An array of status  to filter the time logs by specific status.
     * If not provided, no filtering by status will be applied.
     */
    status: TimesheetStatus[];
}
export {};
