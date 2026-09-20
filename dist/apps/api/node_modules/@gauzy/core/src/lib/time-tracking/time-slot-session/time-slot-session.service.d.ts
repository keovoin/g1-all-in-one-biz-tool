import { ID, ITimeSlotSession } from '@gauzy/contracts';
import { TimeSlotSession } from './time-slot-session.entity';
import { MikroOrmTimeSlotSessionRepository, TypeOrmTimeSlotSessionRepository } from './repository';
import { TenantAwareCrudService } from '../../core';
export declare class TimeSlotSessionService extends TenantAwareCrudService<TimeSlotSession> {
    readonly typeOrmTimeSlotSessionRepository: TypeOrmTimeSlotSessionRepository;
    readonly mikroOrmTimeSlotSessionRepository: MikroOrmTimeSlotSessionRepository;
    constructor(typeOrmTimeSlotSessionRepository: TypeOrmTimeSlotSessionRepository, mikroOrmTimeSlotSessionRepository: MikroOrmTimeSlotSessionRepository);
    /**
     * Create a new TimeSlotSession entry
     */
    createSession(sessionId: string, timeSlotId: ID, employeeId: ID, tenantId: ID, organizationId: ID, startTime?: Date, lastActivity?: Date): Promise<ITimeSlotSession>;
    /**
     * Update session activity time
     */
    updateSessionActivity(sessionId: string, timeSlotId: ID, lastActivity: Date): Promise<void>;
    /**
     * Delete sessions for a specific TimeSlot
     */
    deleteSessionsByTimeSlot(timeSlotId: ID): Promise<void>;
    /**
     * Find sessions by TimeSlot ID
     */
    findSessionsByTimeSlotId(timeSlotId: ID, tenantId: ID, organizationId: ID): Promise<ITimeSlotSession[]>;
    /**
     * Find sessions by Employee ID with optional date range filter
     */
    findSessionsByEmployeeId(employeeId: ID, tenantId: ID, organizationId: ID, startDate?: Date, endDate?: Date): Promise<ITimeSlotSession[]>;
    /**
     * Private helper to find TimeSlots by sessionId with optional date range
     */
    private findTimeSlotsBySessionIdWithRange;
    /**
     * Find TimeSlots by sessionId with time range filter for performance
     */
    findTimeSlotsBySessionId(sessionId: string, tenantId: ID, organizationId: ID): Promise<ITimeSlotSession[]>;
    /**
     * Find TimeSlots by sessionId with custom date range
     */
    findTimeSlotsBySessionIdWithDateRange(sessionId: string, tenantId: ID, organizationId: ID, startDate?: Date, endDate?: Date): Promise<ITimeSlotSession[]>;
    /**
     * Find active sessions (sessions with recent activity)
     */
    findActiveSessions(tenantId: ID, organizationId: ID, employeeId?: ID, activityThresholdMinutes?: number): Promise<ITimeSlotSession[]>;
    /**
     * Count sessions by sessionId
     */
    countSessionsBySessionId(sessionId: string, tenantId: ID, organizationId: ID): Promise<number>;
}
