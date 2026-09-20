import { ICommandHandler } from '@nestjs/cqrs';
import { IVideo } from '../../video.model';
import { VideosService } from '../../services/videos.service';
import { UpdateVideoCommand } from '../update-video.command';
export declare class UpdateVideoHandler implements ICommandHandler<UpdateVideoCommand> {
    readonly videosService: VideosService;
    constructor(videosService: VideosService);
    /**
     * Handles the update of a video entity in the database.
     * This method receives an `UpdateVideoCommand`, updates the video entity with the provided data,
     * and returns the updated video entity.
     *
     * @param command - The command containing the input data for updating the video.
     *
     * @returns A promise that resolves to the updated video entity (`IVideo`).
     */
    execute(command: UpdateVideoCommand): Promise<IVideo>;
}
