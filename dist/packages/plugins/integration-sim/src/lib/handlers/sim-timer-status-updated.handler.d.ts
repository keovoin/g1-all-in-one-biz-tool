import { IEventHandler } from '@nestjs/cqrs';
import { TimerStatusUpdatedEvent } from '@gauzy/core';
import { SimService } from '../sim.service';
export declare class SimTimerStatusUpdatedHandler implements IEventHandler<TimerStatusUpdatedEvent> {
    private readonly simService;
    private readonly logger;
    constructor(simService: SimService);
    /**
     * Handles the TimerStatusUpdatedEvent by triggering any SIM workflow mapped to the 'timer.status_updated' event.
     *
     * @param event - The TimerStatusUpdatedEvent containing the timer status details.
     */
    handle(event: TimerStatusUpdatedEvent): Promise<void>;
}
