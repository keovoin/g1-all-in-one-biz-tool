import { ICommandHandler, EventBus } from '@nestjs/cqrs';
import { StopTimerCommand } from '../../commands';
import { ITimeLog } from '@gauzy/contracts';
import { TimerService } from '../../timer.service';
export declare class StopTimerHandler implements ICommandHandler<StopTimerCommand> {
    private readonly timerService;
    private readonly eventBus;
    constructor(timerService: TimerService, eventBus: EventBus);
    /**
     * Executes the StopTimerCommand.
     *
     * This function stops the timer using the provided command input,
     * publishes a TimerStoppedEvent with the updated time log, and returns the time log.
     *
     * @param command - An instance of StopTimerCommand containing the input data for stopping the timer.
     * @returns A promise that resolves to an ITimeLog representing the stopped timer's log.
     */
    execute(command: StopTimerCommand): Promise<ITimeLog>;
}
