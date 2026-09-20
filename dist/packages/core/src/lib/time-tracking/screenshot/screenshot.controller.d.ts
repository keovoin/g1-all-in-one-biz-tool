import { ID, IScreenshot, UploadedFile } from '@gauzy/contracts';
import { EventBus } from '../../event-bus/event-bus';
import { DeleteScreenshotDTO } from './dto/delete-screenshot.dto';
import { Screenshot } from './screenshot.entity';
import { ScreenshotService } from './screenshot.service';
export declare class ScreenshotController {
    private readonly _screenshotService;
    private readonly _eventBus;
    private readonly logger;
    private logging;
    constructor(_screenshotService: ScreenshotService, _eventBus: EventBus);
    /**
     * Capture a start/stop screenshot
     *
     * @param input The screenshot input data.
     * @param file The uploaded file data.
     * @returns The created screenshot entity.
     */
    create(input: Screenshot, file: UploadedFile): Promise<Screenshot>;
    /**
     * Deletes a screenshot record by its ID.
     *
     * This endpoint allows authorized users to delete a screenshot record by providing its ID.
     * Additional query options can be provided to customize the delete operation.
     *
     * @param id - The UUID of the screenshot to delete.
     * @param options - Additional query options for deletion (e.g., soft delete or force delete).
     * @returns A Promise that resolves with the details of the deleted screenshot.
     */
    delete(id: ID, options: DeleteScreenshotDTO): Promise<IScreenshot>;
}
