import { ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { MultiORM } from '../../../../core/utils';
import { ITrackingSession } from '@gauzy/contracts';
import { TimeSlotService } from '../../../time-slot/time-slot.service';
import { ProcessTrackingDataCommand } from '../process-tracking-data.command';
import { TypeOrmTimeSlotRepository } from '../../../time-slot/repository/type-orm-time-slot.repository';
import { MikroOrmTimeSlotRepository } from '../../../time-slot/repository/mikro-orm-time-slot.repository';
import { TypeOrmTimeSlotSessionRepository } from '../../../time-slot-session/repository/type-orm-time-slot-session.repository';
import { MikroOrmTimeSlotSessionRepository } from '../../../time-slot-session/repository/mikro-orm-time-slot-session.repository';
export declare class ProcessTrackingDataHandler implements ICommandHandler<ProcessTrackingDataCommand> {
    private readonly typeOrmTimeSlotRepository;
    private readonly mikroOrmTimeSlotRepository;
    private readonly typeOrmTimeSlotSessionRepository;
    private readonly mikroOrmTimeSlotSessionRepository;
    private readonly timeSlotService;
    private readonly commandBus;
    private readonly logger;
    protected ormType: MultiORM;
    constructor(typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository, mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository, typeOrmTimeSlotSessionRepository: TypeOrmTimeSlotSessionRepository, mikroOrmTimeSlotSessionRepository: MikroOrmTimeSlotSessionRepository, timeSlotService: TimeSlotService, commandBus: CommandBus);
    execute(command: ProcessTrackingDataCommand): Promise<{
        success: boolean;
        sessionId: string;
        timeSlotId: string;
        message: string;
        session: ITrackingSession | null;
    }>;
    /**
     * Decode tracking payload to extract session information
     */
    private decodeTrackingPayload;
    /**
     * Find existing TimeSlot or create new one for the tracking time
     */
    private findOrCreateTimeSlot;
    /**
     * Get complete session data across all TimeSlots with the same sessionId
     */
    private getCompleteSessionData;
    /**
     * Update TimeSlot with tracking data (store both encoded and decoded data)
     */
    private updateTimeSlotWithTrackingData;
    /**
     * Update the customActivity field of a time slot using the active ORM.
     */
    private updateTimeSlotCustomActivity;
    /**
     * Create or update TimeSlotSession mapping entry
     */
    private createOrUpdateTimeSlotSession;
}
