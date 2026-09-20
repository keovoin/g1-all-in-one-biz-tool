import { ITrackingSession, ITimeLog, ITrackingSessionResponse } from '@gauzy/contracts';
import { CustomTrackingService } from './custom-tracking.service';
import { CustomTrackingSessionsQueryDTO, CustomTrackingBulkInputDTO, ProcessTrackingDataDTO, BulkProcessResult } from './dto';
export declare class CustomTrackingController {
    private readonly customTrackingService;
    constructor(customTrackingService: CustomTrackingService);
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
    submitBulkTrackingData(input: CustomTrackingBulkInputDTO): Promise<{
        results: BulkProcessResult[];
        summary: {
            total: number;
            successful: number;
            failed: number;
        };
    }>;
    /**
     * Get custom tracking sessions with filtering and grouping
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
     * Get tracking sessions by sessionId with efficient lookup
     */
    getSessionsBySessionId(sessionId: string, startDate?: string, endDate?: string): Promise<ITrackingSessionResponse[]>;
    /**
     * Get active tracking sessions
     */
    getActiveSessions(employeeId?: string, activityThresholdMinutes?: number): Promise<any[]>;
}
