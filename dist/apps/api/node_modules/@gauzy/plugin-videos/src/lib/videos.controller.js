"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_video_command_1 = require("./commands/create-video.command");
const delete_video_command_1 = require("./commands/delete-video.command");
const update_video_command_1 = require("./commands/update-video.command");
const dto_1 = require("./dto");
const count_video_dto_1 = require("./dto/count-video.dto");
const video_entity_1 = require("./entities/video.entity");
const get_video_count_query_1 = require("./queries/get-video-count.query");
const get_video_query_1 = require("./queries/get-video.query");
const get_videos_query_1 = require("./queries/get-videos.query");
let VideosController = class VideosController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * Handles the retrieval of all videos with optional pagination and filtering.
     *
     * @param params - Pagination and filter parameters for fetching videos.
     *
     * @returns A promise that resolves to a paginated result of videos, including metadata.
     *
     * @throws {HttpException} Throws an exception if no videos are found or an error occurs.
     */
    async findAll(params) {
        return this.queryBus.execute(new get_videos_query_1.GetVideosQuery(params));
    }
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
    async create(input, file) {
        if (!file.key) {
            console.warn('Video file key is empty');
            return;
        }
        try {
            const provider = new core_1.FileStorage().getProvider();
            // Convert the plain object to a class instance
            const fileInstance = (0, class_transformer_1.plainToInstance)(dto_1.FileDTO, file);
            // Validate the file DTO
            const errors = await (0, class_validator_1.validate)(fileInstance);
            // Check for validation errors
            if (errors.length > 0) {
                // Delete the uploaded file if validation fails
                await provider.deleteFile(file.key);
                // Throw a bad request exception with the validation errors
                throw new common_1.BadRequestException(errors);
            }
            // The fileFilter and the DTO both judge the client-sent MIME type; re-check the stored
            // bytes so markup can never survive on disk (GHSA-p334-cm7f-php5 class). Skipped for
            // large uploads, which would have to be held in memory to read — see shouldScanForMarkup.
            if ((0, core_1.shouldScanForMarkup)(file.size)) {
                try {
                    (0, core_1.assertNotMarkupContent)(await provider.getFile(file.key));
                }
                catch (error) {
                    try {
                        await provider.deleteFile(file.key);
                    }
                    catch {
                        // Best-effort cleanup: a failed delete must not replace the rejection below.
                    }
                    throw error;
                }
            }
            // Extract necessary properties from the request body
            const tenantId = input.tenantId || core_1.RequestContext.currentTenantId();
            const organizationId = input.organizationId;
            const uploadedById = input.uploadedById || core_1.RequestContext.currentEmployeeId();
            const storageProvider = provider.name.toUpperCase();
            // Create a new video record
            return this.commandBus.execute(new create_video_command_1.CreateVideoCommand({
                ...input,
                tenantId,
                organizationId,
                storageProvider,
                uploadedById,
                file
            }));
        }
        catch (error) {
            // Ensure cleanup of uploaded file
            if (file?.key) {
                await new core_1.FileStorage().getProvider().deleteFile(file.key);
            }
            // Throw a bad request exception with the validation errors
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * GET video count in the same tenant.
     *
     * This endpoint retrieves the count of videos within a specific tenant.
     * It takes query parameters to filter the video count by certain criteria.
     *
     * @param options Query parameters to filter the video count.
     * @returns A promise resolving to the total count of videos in the tenant.
     */
    async getCount(options) {
        return this.queryBus.execute(new get_video_count_query_1.GetVideoCountQuery(options));
    }
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
    async update(id, input) {
        return this.commandBus.execute(new update_video_command_1.UpdateVideoCommand(id, input));
    }
    /**
     * Retrieves a video record by its ID.
     *
     * @param id - The UUID of the video to retrieve.2024-12-23T08:00:00.000Z
     * @param options - Additional query options for finding the video.
     * @returns A Promise that resolves with the details of the video.
     *
     */
    async findById(id, options) {
        return this.queryBus.execute(new get_video_query_1.GetVideoQuery(id, options));
    }
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
    async delete(id, options) {
        // Execute the delete video command
        return this.commandBus.execute(new delete_video_command_1.DeleteVideoCommand({ id, options }));
    }
};
exports.VideosController = VideosController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve a list of videos with optional pagination and filtering.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of videos retrieved successfully.',
        type: video_entity_1.Video,
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No videos found matching the provided criteria.'
    }),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], VideosController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create video',
        description: 'This API Endpoint allows uploading the video file along with related metadata.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Video successfully.',
        type: video_entity_1.Video
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input provided. Check the response body for error details.'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    (0, common_1.UseInterceptors)(
    // Use LazyFileInterceptor for handling file uploads with custom storage settings
    (0, core_1.LazyFileInterceptor)('file', {
        // Define storage settings for uploaded files
        storage: () => core_1.FileStorageFactory.create('videos'),
        // Videos are served unauthenticated from `/public/<key>` with a Content-Type derived from the
        // stored extension, so an `.svg`/`.html` upload claiming `video/mp4` would execute script in
        // the app origin (GHSA-p334-cm7f-php5 class).
        fileFilter: core_1.videoUploadFileFilter
    })),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, core_1.UploadedFileStorage)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateVideoDTO, dto_1.FileDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], VideosController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get video count in the same tenant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the video count.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid query parameters. Please check your input.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'An error occurred while retrieving the video count.'
    }),
    (0, common_1.Get)('count'),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [count_video_dto_1.CountVideoDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], VideosController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update a video by ID',
        description: 'Updates an existing video record based on the provided ID and metadata.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The video has been successfully updated.',
        type: video_entity_1.Video
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Video record not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong.'
    }),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateVideoDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], VideosController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get video by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VideosController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a video by ID',
        description: 'Deletes a video record from the system based on the provided ID.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The video has been successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Video record not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User does not have permission to delete videos.'
    }),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VideosController.prototype, "delete", null);
exports.VideosController = VideosController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Video Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.TIME_TRACKER),
    (0, common_1.Controller)('/plugins/videos'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], VideosController);
//# sourceMappingURL=videos.controller.js.map