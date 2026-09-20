import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { VideosService } from '../../services/videos.service';
import { IVideo } from '../../video.model';
import { GetVideosQuery } from '../get-videos.query';
export declare class GetVideosQueryHandler implements IQueryHandler<GetVideosQuery> {
    private readonly videosService;
    constructor(videosService: VideosService);
    /**
     * Handles the `GetVideosQuery` to retrieve a paginated list of video entities.
     *
     * @param query - The `GetVideosQuery` containing parameters for pagination and filtering.
     *
     * @returns A promise resolving to a paginated result (`IPagination<IVideo>`), including a list of videos and metadata.
     */
    execute(query: GetVideosQuery): Promise<IPagination<IVideo>>;
}
