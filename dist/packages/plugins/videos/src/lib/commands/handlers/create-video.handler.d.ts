import { ICommandHandler } from '@nestjs/cqrs';
import { IVideo } from '../../video.model';
import { VideosService } from '../../services/videos.service';
import { CreateVideoCommand } from '../create-video.command';
export declare class CreateVideoHandler implements ICommandHandler<CreateVideoCommand> {
    private readonly videosService;
    constructor(videosService: VideosService);
    /**
     * Handles the `CreateVideoCommand` to create a new video entity in the database.
     *
     * @param command - The `CreateVideoCommand` containing the input data for the new video.
     *
     * @returns A promise resolving to the newly created video entity (`IVideo`).
     */
    execute(command: CreateVideoCommand): Promise<IVideo>;
}
