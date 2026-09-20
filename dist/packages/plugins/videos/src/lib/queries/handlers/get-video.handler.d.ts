import { IQueryHandler } from '@nestjs/cqrs';
import { VideosService } from '../../services/videos.service';
import { IVideo } from '../../video.model';
import { GetVideoQuery } from '../get-video.query';
export declare class GetVideoQueryHandler implements IQueryHandler<GetVideoQuery> {
    private readonly videosService;
    constructor(videosService: VideosService);
    /**
     * Handles the `GetVideoQuery` to retrieve a video entity by its ID.
     *
     * @param query - The `GetVideoQuery` containing the ID of the video to be fetched and optional query options.
     *
     * @returns A promise resolving to the video entity (`IVideo`) if found.
     *
     * @throws {NotFoundException} If the video with the specified ID is not found.
     */
    execute(query: GetVideoQuery): Promise<IVideo>;
}
