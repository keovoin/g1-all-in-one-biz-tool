import { ID, ITimeLogFilters } from '@gauzy/contracts';
import { DateRangeQueryDTO } from './date-range-query.dto';
/**
 * Data Transfer Object for filtering time logs by various selectors.
 * Extends DateRangeQueryDTO to include date range filters alongside employee, project, task, and team selectors.
 */
export declare class SelectorsQueryDTO extends DateRangeQueryDTO implements ITimeLogFilters {
    /**
     * An array of employee IDs to filter the time logs by specific employees.
     * If not provided, no filtering by employee will be applied.
     */
    employeeIds: ID[];
    /**
     * An array of project IDs to filter the time logs by specific projects.
     * If not provided, no filtering by project will be applied.
     */
    projectIds: ID[];
    /**
     * An array of task IDs to filter the time logs by specific tasks.
     * If not provided, no filtering by task will be applied.
     */
    taskIds: ID[];
    /**
     * An array of team IDs to filter the time logs by specific teams.
     * If not provided, no filtering by team will be applied.
     */
    teamIds: ID[];
}
