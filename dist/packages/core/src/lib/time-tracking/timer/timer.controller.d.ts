import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ITimeLog, ITimerStatus } from '@gauzy/contracts';
import { TimerService } from './timer.service';
import { StartTimerDTO, StopTimerDTO, TimerStatusQueryDTO } from './dto';
export declare class TimerController {
    private readonly timerService;
    private readonly _commandBus;
    private readonly _queryBus;
    constructor(timerService: TimerService, _commandBus: CommandBus, _queryBus: QueryBus);
    /**
     * GET timer today's status.
     *
     * Retrieves the timer status for today based on the provided query parameters.
     *
     * @param query - An object of type TimerStatusQueryDTO containing query parameters.
     * @returns A promise that resolves to an ITimerStatus object representing today's timer status.
     */
    getTimerStatus(query: TimerStatusQueryDTO): Promise<ITimerStatus>;
    /**
     * GET timer last worked status.
     *
     * Retrieves the last worked timer statuses based on the provided query parameters.
     *
     * @param query - An object of type TimerStatusQueryDTO containing query parameters.
     * @returns A promise that resolves to an array of ITimerStatus objects representing the last worked statuses.
     */
    getTimerWorkedStatus(query: TimerStatusQueryDTO): Promise<ITimerStatus[]>;
    /**
     * Toggle timer.
     *
     * Toggles the timer state (On/Off) based on the provided data.
     *
     * @param entity - A StartTimerDTO object containing the necessary data to toggle the timer.
     * @returns A promise that resolves to an ITimeLog object representing the timer log after toggling,
     *          or null if no log is created.
     */
    toggleTimer(entity: StartTimerDTO): Promise<ITimeLog | null>;
    /**
     * Start timer endpoint.
     *
     * This endpoint starts the timer by executing the StartTimerCommand.
     *
     * @param entity - A StartTimerDTO object containing the necessary data to start the timer.
     * @returns A promise that resolves to an ITimeLog object representing the timer's log after it has started.
     */
    startTimer(entity: StartTimerDTO): Promise<ITimeLog>;
    /**
     * Stop timer endpoint.
     *
     * This endpoint stops the timer by executing the StopTimerCommand.
     *
     * @param entity - A StopTimerDTO object containing the necessary data to stop the timer.
     * @returns A promise that resolves to an ITimeLog object representing the timer's log after it has stopped,
     *          or null if the timer was not running.
     */
    stopTimer(entity: StopTimerDTO): Promise<ITimeLog | null>;
}
