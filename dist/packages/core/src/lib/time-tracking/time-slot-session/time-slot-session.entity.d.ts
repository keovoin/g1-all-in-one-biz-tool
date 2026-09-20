import { ID, IEmployee, ITimeSlot, ITimeSlotSession } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from './../../core/entities/internal';
export declare class TimeSlotSession extends TenantOrganizationBaseEntity implements ITimeSlotSession {
    /**
     * Session identifier for tracking across multiple TimeSlots
     */
    sessionId: string;
    /**
     * Session start time
     */
    startTime?: Date;
    /**
     * Session last activity time
     */
    lastActivity?: Date;
    /**
     * TimeSlot relationship
     */
    timeSlot: ITimeSlot;
    timeSlotId: ID;
    /**
     * Employee relationship
     */
    employee: IEmployee;
    employeeId: ID;
}
