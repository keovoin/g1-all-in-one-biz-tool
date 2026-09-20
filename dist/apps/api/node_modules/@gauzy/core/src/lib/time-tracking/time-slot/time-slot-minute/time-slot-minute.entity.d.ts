import { ID, ITimeSlot, ITimeSlotMinute, JsonData } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../../../core/entities/internal';
export declare class TimeSlotMinute extends TenantOrganizationBaseEntity implements ITimeSlotMinute {
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
     * Number of movements (e.g., mouse or device movements) detected within one minute.
     * Used to track activity levels during time tracking sessions.
     */
    location?: number;
    /**
     * The specific datetime for this time slot minute.
     * It records the exact minute in which the activity was tracked.
     */
    datetime: Date;
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
    /**
     * The reference to the `TimeSlot` entity to which this minute belongs.
     * This establishes a many-to-one relationship with the `TimeSlot` entity.
     * The deletion of a `TimeSlot` cascades down to its `TimeSlotMinute` records.
     */
    timeSlot: ITimeSlot;
    /**
     * The ID of the related `TimeSlot` entity, stored as a UUID.
     * This is a relation ID that helps link the minute to the corresponding `TimeSlot`.
     */
    timeSlotId: ID;
}
