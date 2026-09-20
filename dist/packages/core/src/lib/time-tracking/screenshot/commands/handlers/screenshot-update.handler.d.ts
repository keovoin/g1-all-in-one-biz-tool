import { ICommandHandler } from '@nestjs/cqrs';
import { ScreenshotUpdateCommand } from '../screenshot-update.command';
import { ScreenshotService } from '../../../screenshot/screenshot.service';
import { Screenshot } from '../../screenshot.entity';
export declare class ScreenshotUpdateHandler implements ICommandHandler<ScreenshotUpdateCommand> {
    private readonly _screenshotService;
    constructor(_screenshotService: ScreenshotService);
    /**
     * Handles the update of a screenshot entity.
     *
     * @param {ScreenshotUpdateCommand} command - The command containing the data required for screenshot update.
     * @returns {Promise<any>} - The updated screenshot entity or an error if the process fails.
     * @throws {BadRequestException} - Throws an exception if screenshot update fails.
     */
    execute(command: ScreenshotUpdateCommand): Promise<Screenshot>;
}
