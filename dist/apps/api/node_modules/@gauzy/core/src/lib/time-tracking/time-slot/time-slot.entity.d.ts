import { ITimeSlot, ITimeSlotMinute, IActivity, IScreenshot, IEmployee, ITimeLog, ITimeSlotSession, ID, JsonData } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from './../../core/entities/internal';
export declare class TimeSlot extends TenantOrganizationBaseEntity implements ITimeSlot {
    /**
     * The number of seconds employee spent in the given time slot.
     * Defaults to 0 if not provided.
     */
    duration?: number;
    /**
     * The number of keyboard interactions in the given time slot minute.
     * Defaults to 0 if not provided.
     */
    keyboard?: number;
    /**
     * The number of mouse interactions in the given time slot minute.
     * Defaults to 0 if not provided.
     */
    mouse?: number;
    /**
     * Number of movements (e.g., mouse or device movements) detected within 10 minutes.
     * Used to track activity levels during time tracking sessions.
     */
    location?: number;
    /**
     * The overall activity time of the time slot.
     */
    overall?: number;
    /**
     * The start time of the time slot.
     */
    startedAt: Date;
    /**
     * Raw keyboard and mouse activity data (e.g., event logs or durations).
     */
    kbMouseActivity?: JsonData;
    /**
     * Raw location activity data (e.g., coordinates or movement patterns).
     */
    locationActivity?: JsonData;
    /**
     * Custom-defined activity data (e.g., domain-specific or extension usage).
     */
    customActivity?: JsonData;
    stoppedAt?: Date;
    percentage?: number;
    keyboardPercentage?: number;
    mousePercentage?: number;
    /**
     * The reference to the `Employee` entity to which this time slot belongs.
     */
    employee?: IEmployee;
    /**
     * The ID of the related `Employee` entity, stored as a UUID.
     */
    employeeId: ID;
    /**
     * The reference to the `Screenshot` entity to which this time slot belongs.
     */
    screenshots?: IScreenshot[];
    /**
     * The reference to the `Activity` entity to which this time slot belongs.
     */
    activities?: IActivity[];
    /**
     * The reference to the `TimeSlotMinute` entity to which this time slot belongs.
     */
    timeSlotMinutes?: ITimeSlotMinute[];
    /**
     * The reference to the `TimeSlotSession` entities associated with this time slot.
     */
    timeSlotSessions?: ITimeSlotSession[];
    /**
     * The reference to the `TimeLog` entity to which this time slot belongs.
     */
    timeLogs?: ITimeLog[];
}
