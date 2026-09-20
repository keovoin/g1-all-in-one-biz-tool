import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { VideosService } from '../../services/videos.service';
import { DeleteVideoCommand } from '../delete-video.command';
export declare class DeleteVideoHandler implements ICommandHandler<DeleteVideoCommand> {
    private readonly videosService;
    constructor(videosService: VideosService);
    /**
     * Handles the `DeleteVideoCommand` to delete a video entity from the database.
     * Validates the existence of the video and performs the deletion based on the provided criteria.
     *
     * @param command - The `DeleteVideoCommand` containing the video ID and additional options for deletion.
     *
     * @returns A promise resolving to a `DeleteResult`, which includes metadata about the deletion operation.
     *
     * @throws {NotFoundException} If the video with the specified ID does not exist.
     */
    execute(command: DeleteVideoCommand): Promise<DeleteResult>;
}
