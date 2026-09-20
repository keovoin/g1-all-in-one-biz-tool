import { ICommandHandler, EventBus } from '@nestjs/cqrs';
import { ITimeLog } from '@gauzy/contracts';
import { StartTimerCommand } from '../../commands';
import { TimerService } from '../../timer.service';
export declare class StartTimerHandler implements ICommandHandler<StartTimerCommand> {
    private readonly timerService;
    private readonly eventBus;
    constructor(timerService: TimerService, eventBus: EventBus);
    /**
     * Executes the StartTimerCommand.
     *
     * This function starts a new timer using the provided command input,
     * publishes a TimerStartedEvent with the generated time log,
     * and returns the time log.
     *
     * @param command - An instance of StartTimerCommand containing the input data to start the timer.
     * @returns A promise that resolves to an ITimeLog representing the started timer's log.
     */
    execute(command: StartTimerCommand): Promise<ITimeLog>;
}
