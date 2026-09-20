import { CommandBus } from '@nestjs/cqrs';
import { ITrackingSession, ITrackingSessionResponse, ITimeLog } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../../core/crud';
import { TimeSlot } from '../time-slot/time-slot.entity';
import { CustomTrackingSessionsQueryDTO, ProcessTrackingDataDTO } from './dto';
import { TypeOrmTimeSlotRepository } from '../time-slot/repository/type-orm-time-slot.repository';
import { MikroOrmTimeSlotRepository } from '../time-slot/repository/mikro-orm-time-slot.repository';
import { TypeOrmTimeSlotSessionRepository } from '../time-slot-session/repository/type-orm-time-slot-session.repository';
import { MikroOrmTimeSlotSessionRepository } from '../time-slot-session/repository/mikro-orm-time-slot-session.repository';
export declare class CustomTrackingService extends TenantAwareCrudService<TimeSlot> {
    readonly typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository;
    readonly mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository;
    readonly typeOrmTimeSlotSessionRepository: TypeOrmTimeSlotSessionRepository;
    readonly mikroOrmTimeSlotSessionRepository: MikroOrmTimeSlotSessionRepository;
    private readonly commandBus;
    constructor(typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository, mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository, typeOrmTimeSlotSessionRepository: TypeOrmTimeSlotSessionRepository, mikroOrmTimeSlotSessionRepository: MikroOrmTimeSlotSessionRepository, commandBus: CommandBus);
    /**
     * Submit custom tracking data
     */
    submitTrackingData(input: ProcessTrackingDataDTO): Promise<{
        success: boolean;
        sessionId: string;
        timeSlotId: string;
        message: string;
        session: ITrackingSession | null;
    }>;
    /**
     * Submit bulk custom tracking data
     */
    submitBulkTrackingData(input: ProcessTrackingDataDTO[]): Promise<{
        results: Array<{
            success: boolean;
            sessionId: string;
            timeSlotId: string;
            message: string;
            session: ITrackingSession | null;
            index: number;
            error?: string;
        }>;
        summary: {
            total: number;
            successful: number;
            failed: number;
        };
    }>;
    /**
     * Get custom tracking sessions with optional filtering and grouping
     */
    getTrackingSessions(query: CustomTrackingSessionsQueryDTO): Promise<{
        sessions: ITrackingSessionResponse[];
        summary: {
            totalSessions: number;
            totalTimeSlots: number;
            dateRange: {
                start: Date;
                end: Date;
            } | null;
        };
    }>;
    /**
     * Get tracking data for a specific TimeSlot
     */
    getTimeSlotTrackingData(timeSlotId: string): Promise<{
        timeSlotId: string;
        hasTrackingData: boolean;
        message?: string;
        timeSlot?: {
            startedAt: Date;
            duration: number;
            timeLogs: ITimeLog[];
        };
        trackingSessions?: ITrackingSession[];
    }>;
    /**
     * Get date range with defaults to prevent loading millions of records
     * Default to last 48 hours if no dates provided
     */
    private getDateRangeWithDefaults;
    /**
     * Get TimeSlotSessions
     */
    private getTimeSlotSessionsWithFilters;
    /**
     * Extract tracking sessions from TimeSlotSessions
     */
    private extractTrackingSessionsFromTimeSlotSessions;
    /**
     * Group tracking sessions by sessionId across multiple TimeSlots
     */
    private groupSessionsBySessionId;
    /**
     * Calculate summary statistics for sessions
     */
    private calculateSessionsSummary;
    /**
     * Get tracking sessions by sessionId
     */
    getSessionsBySessionId(sessionId: string, tenantId?: string, organizationId?: string, startDate?: Date, endDate?: Date): Promise<ITrackingSessionResponse[]>;
    /**
     * Get active sessions for an employee
     * Sessions with activity in the last N minutes
     */
    getActiveSessions(employeeId?: string, activityThresholdMinutes?: number, tenantId?: string, organizationId?: string): Promise<ITrackingSessionResponse[]>;
}
