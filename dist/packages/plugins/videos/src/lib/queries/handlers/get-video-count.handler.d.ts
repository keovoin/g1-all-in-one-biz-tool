import { IQueryHandler } from '@nestjs/cqrs';
import { VideosService } from '../../services/videos.service';
import { GetVideoCountQuery } from '../get-video-count.query';
/**
 * Handler for the `GetVideoCountQuery` that retrieves the count of video entities
 * based on the provided query parameters and user permissions.
 */
export declare class GetVideoCountQueryHandler implements IQueryHandler<GetVideoCountQuery> {
    private readonly videosService;
    /**
     * Constructs the `GetVideoCountQueryHandler`.
     *
     * @param videosService - The service responsible for video-related operations.
     */
    constructor(videosService: VideosService);
    /**
     * Executes the `GetVideoCountQuery` to retrieve the count of video entities.
     *
     * Validates the query, checks user permissions, builds appropriate where conditions,
     * and returns the count of matching video records.
     *
     * @param query - The `GetVideoCountQuery` containing the query options.
     * @returns A Promise that resolves to the count of video entities.
     * @throws {BadRequestException} If query options are invalid or required parameters are missing.
     */
    execute(query: GetVideoCountQuery): Promise<number>;
    /**
     * Validates the query parameters to ensure all required fields are present.
     *
     * @param query - The `GetVideoCountQuery` to validate.
     * @throws {BadRequestException} If any required parameter is missing.
     */
    private validateQuery;
    /**
     * Builds the where conditions for the video count query based on organization,
     * tenant, and user permissions.
     *
     * @param organizationId - The ID of the organization to filter videos by.
     * @param tenantId - The ID of the tenant to filter videos by.
     * @param hasPermission - Boolean indicating if user has permission to view all videos.
     * @returns An object containing the where conditions for the query.
     * @throws {BadRequestException} If current employee ID cannot be determined for restricted access.
     */
    private buildWhereConditions;
}
