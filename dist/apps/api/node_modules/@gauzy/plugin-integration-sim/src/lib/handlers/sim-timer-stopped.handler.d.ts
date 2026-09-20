import { IEventHandler } from '@nestjs/cqrs';
import { TimerStoppedEvent } from '@gauzy/core';
import { SimService } from '../sim.service';
export declare class SimTimerStoppedHandler implements IEventHandler<TimerStoppedEvent> {
    private readonly simService;
    private readonly logger;
    constructor(simService: SimService);
    /**
     * Handles the TimerStoppedEvent by triggering any SIM workflow mapped to the 'timer.stopped' event.
     *
     * @param event - The TimerStoppedEvent containing the time log details.
     */
    handle(event: TimerStoppedEvent): Promise<void>;
}
