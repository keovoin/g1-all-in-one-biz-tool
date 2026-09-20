import { IEventHandler } from '@nestjs/cqrs';
import { TimerStartedEvent } from '@gauzy/core';
import { SimService } from '../sim.service';
export declare class SimTimerStartedHandler implements IEventHandler<TimerStartedEvent> {
    private readonly simService;
    private readonly logger;
    constructor(simService: SimService);
    /**
     * Handles the TimerStartedEvent by triggering any SIM workflow mapped to the 'timer.started' event.
     *
     * @param event - The TimerStartedEvent containing the time log details.
     */
    handle(event: TimerStartedEvent): Promise<void>;
}
