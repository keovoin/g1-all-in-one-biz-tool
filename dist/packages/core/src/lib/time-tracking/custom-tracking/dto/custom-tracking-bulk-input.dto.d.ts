import { IProcessTrackingDataBulkInput, ITrackingSession } from '@gauzy/contracts';
import { ProcessTrackingDataDTO } from './process-tracking-data.dto';
/**
 * DTO for bulk custom tracking data submission
 */
export declare class CustomTrackingBulkInputDTO implements IProcessTrackingDataBulkInput {
    readonly list: ProcessTrackingDataDTO[];
}
export type BulkProcessResult = {
    success: boolean;
    sessionId: string;
    timeSlotId: string;
    message: string;
    session: ITrackingSession | null;
    index: number;
    error?: string;
};
