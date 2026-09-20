import { ID, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO } from '@gauzy/core';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindOneOptions } from 'typeorm';
import { CreateVideoDTO, FileDTO, UpdateVideoDTO } from './dto';
import { CountVideoDTO } from './dto/count-video.dto';
import { Video } from './entities/video.entity';
import { IDeleteVideo, IVideo } from './video.model';
export declare class VideosController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * Handles the retrieval of all videos with optional pagination and filtering.
     *
     * @param params - Pagination and filter parameters for fetching videos.
     *
     * @returns A promise that resolves to a paginated result of videos, including metadata.
     *
     * @throws {HttpException} Throws an exception if no videos are found or an error occurs.
     */
    findAll(params: BaseQueryDTO<Video>): Promise<IPagination<IVideo>>;
    /**
     * Create a new video record.
     *
     * This endpoint allows authorized users to create a new video record by providing the necessary metadata.
     * The video file should be uploaded as a form-data file with the key 'file'.
     *
     * @param input - The metadata for the video record.
     * @param file - The uploaded video file.
     * @returns A Promise that resolves with the details of the created video.
     */
    create(input: CreateVideoDTO, file: FileDTO): Promise<any>;
    /**
     * GET video count in the same tenant.
     *
     * This endpoint retrieves the count of videos within a specific tenant.
     * It takes query parameters to filter the video count by certain criteria.
     *
     * @param options Query parameters to filter the video count.
     * @returns A promise resolving to the total count of videos in the tenant.
     */
    getCount(options: CountVideoDTO): Promise<number>;
    /**
     * Updates an existing video record.
     *
     * This endpoint allows authorized users to update an existing video record by providing its ID
     * and the necessary updated metadata.
     *
     * @param id - The UUID of the video to update.
     * @param input - The updated video metadata.
     * @returns A Promise that resolves with the details of the updated video.
     */
    update(id: ID, input: UpdateVideoDTO): Promise<IVideo>;
    /**
     * Retrieves a video record by its ID.
     *
     * @param id - The UUID of the video to retrieve.2024-12-23T08:00:00.000Z
     * @param options - Additional query options for finding the video.
     * @returns A Promise that resolves with the details of the video.
     *
     */
    findById(id: ID, options: FindOneOptions<IVideo>): Promise<IVideo>;
    /**
     * Deletes a video record by its ID.
     *
     * This endpoint allows authorized users to delete a video record by providing its ID.
     * Additional query options can be provided to customize the delete operation.
     *
     * @param id - The UUID of the video to delete.
     * @param options - Additional query options for deletion (e.g., soft delete or force delete).
     * @returns A Promise that resolves with the details of the deleted video.
     */
    delete(id: ID, options?: IDeleteVideo): Promise<void>;
}
