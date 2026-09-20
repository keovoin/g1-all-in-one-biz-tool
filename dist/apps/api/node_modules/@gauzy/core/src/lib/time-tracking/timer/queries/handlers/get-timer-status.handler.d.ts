import { EventBus, IQueryHandler } from '@nestjs/cqrs';
import { ITimerStatus } from '@gauzy/contracts';
import { TimerService } from '../../timer.service';
import { GetTimerStatusQuery } from '../get-timer-status.query';
export declare class GetTimerStatusHandler implements IQueryHandler<GetTimerStatusQuery> {
    private readonly timerService;
    private readonly eventBus;
    constructor(timerService: TimerService, eventBus: EventBus);
    /**
     * Executes the GetTimerStatusQuery command.
     *
     * This function retrieves the timer status based on the provided input,
     * publishes a TimerStatusUpdatedEvent with the obtained status, and returns the status.
     *
     * @param command - An instance of GetTimerStatusQuery containing the input data.
     * @returns A promise that resolves to the current timer status as an ITimerStatus object.
     */
    execute(command: GetTimerStatusQuery): Promise<ITimerStatus>;
}
