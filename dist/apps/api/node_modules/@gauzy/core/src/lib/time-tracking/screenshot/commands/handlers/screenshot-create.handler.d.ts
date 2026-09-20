import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { ScreenshotCreateCommand } from './../screenshot-create.command';
import { ScreenshotService } from './../../../screenshot/screenshot.service';
import { TimeSlotService } from './../../../time-slot/time-slot.service';
export declare class ScreenshotCreateHandler implements ICommandHandler<ScreenshotCreateCommand> {
    private readonly _screenshotService;
    private readonly _timeSlotService;
    private readonly _commandBus;
    constructor(_screenshotService: ScreenshotService, _timeSlotService: TimeSlotService, _commandBus: CommandBus);
    /**
     * Handles the creation of a screenshot and associates it with a time slot.
     * If a time slot does not exist for the given timestamp, a new time slot is created.
     *
     * @param {ScreenshotCreateCommand} command - The command containing the data required for screenshot creation.
     * @returns {Promise<any>} - The created screenshot entity or an error if the process fails.
     * @throws {BadRequestException} - Throws an exception if screenshot creation fails.
     */
    execute(command: ScreenshotCreateCommand): Promise<any>;
}
