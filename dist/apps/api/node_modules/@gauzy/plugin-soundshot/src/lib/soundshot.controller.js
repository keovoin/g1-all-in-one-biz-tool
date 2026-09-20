"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundshotController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const create_soundshot_command_1 = require("./commands/create-soundshot.command");
const delete_soundshot_command_1 = require("./commands/delete-soundshot.command");
const count_soundshot_dto_1 = require("./dtos/count-soundshot.dto");
const create_soundshot_dto_1 = require("./dtos/create-soundshot.dto");
const delete_soundshot_dto_1 = require("./dtos/delete-soundshot.dto");
const file_dto_1 = require("./dtos/file.dto");
const get_soundshots_query_dto_1 = require("./dtos/get-soundshots-query.dto");
const soundshot_entity_1 = require("./entity/soundshot.entity");
const get_soundshot_count_query_1 = require("./queries/get-soundshot-count.query");
const get_soundshot_query_1 = require("./queries/get-soundshot.query");
const get_soundshots_query_1 = require("./queries/get-soundshots.query");
const soundshot_service_1 = require("./services/soundshot.service");
const commands_1 = require("./commands");
let SoundshotController = class SoundshotController {
    constructor(commandBus, queryBus, soundshotService) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.soundshotService = soundshotService;
    }
    /**
     * Get a paginated list of soundshots.
     *
     * This endpoint allows authorized users to retrieve a paginated list of soundshots with optional filtering and sorting.
     * The endpoint supports pagination, filtering, and sorting through the query parameters.
     *
     * @param params - Pagination and filtering parameters for soundshots
     * @returns Promise<IPagination<ISoundshot>> A Promise that resolves with the paginated list of soundshots
     * @throws {UnauthorizedException} If the user is not authorized to access the soundshots
     * @throws {ForbiddenException} If the user does not have permission to list soundshots
     */
    async list(params) {
        return this.queryBus.execute(new get_soundshots_query_1.GetSoundshotsQuery(params));
    }
    /**
     * Create a new soundshot record.
     *
     * This endpoint allows authorized users to create a new soundshot record by providing the necessary metadata.
     * The soundshot file should be uploaded as a form-data file with the key 'file'.
     *
     * @param input - The metadata for the soundshot record.
     * @param file - The uploaded soundshot file.
     * @returns A Promise that resolves with the details of the created soundshot.
     */
    async create(input, file) {
        // Check if the file key is empty
        if (!file.key) {
            throw new common_1.BadRequestException('Soundshot file key is empty');
        }
        // The fileFilter above only sees the MIME type and filename the client sent, both of which it controls.
        // Re-check the stored bytes and drop the file before any record is created — `/public` serves
        // straight from disk regardless of the DB row (GHSA-p334-cm7f-php5 class).
        // Skipped for large uploads, which would have to be held in memory to read — see
        // shouldScanForMarkup; the extension allowlist carries the protection on its own there.
        const provider = new core_1.FileStorage().getProvider();
        if ((0, core_1.shouldScanForMarkup)(file.size)) {
            try {
                (0, core_1.assertNotMarkupContent)(await provider.getFile(file.key));
            }
            catch (error) {
                try {
                    await provider.deleteFile(file.key);
                }
                catch {
                    // best-effort cleanup; the rejection below is what matters
                }
                throw error;
            }
        }
        // Try to create a new soundshot record
        try {
            // Create a new soundshot record
            return this.commandBus.execute(new create_soundshot_command_1.CreateSoundshotCommand(input, file));
        }
        catch (error) {
            // Ensure cleanup of uploaded file
            if (file?.key && file?.storageProvider) {
                await this.soundshotService.getFileStorageProviderInstance(file.storageProvider).deleteFile(file.key);
            }
            // Throw a bad request exception with the validation errors
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * GET soundshot count in the same tenant.
     *
     * This endpoint retrieves the count of soundshots within a specific tenant.
     * It takes query parameters to filter the soundshot count by certain criteria.
     *
     * @param options Query parameters to filter the soundshot count.
     * @returns A promise resolving to the total count of soundshots in the tenant.
     */
    async getCount(options) {
        return this.queryBus.execute(new get_soundshot_count_query_1.GetSoundshotCountQuery(options));
    }
    /**
     * Retrieves a soundshot record by its ID.
     *
     * @param id - The UUID of the soundshot to retrieve.
     * @param options - Additional query options for finding the soundshot.
     * @returns A Promise that resolves with the details of the soundshot.
     */
    async findById(id, options) {
        return this.queryBus.execute(new get_soundshot_query_1.GetSoundshotQuery(id, options));
    }
    /**
     * Recover a soft-deleted soundshot.
     */
    async recover(id) {
        return this.commandBus.execute(new commands_1.RecoverSoundshotCommand(id));
    }
    /**
     * Delete a soundshot record.
     *
     * This endpoint allows authorized users to delete a soundshot record by providing the necessary ID.
     *
     * @param id - The ID of the soundshot to be deleted.
     * @returns A promise resolving to the result of the deletion operation.
     */
    async delete(id, options) {
        await this.commandBus.execute(new delete_soundshot_command_1.DeleteSoundshotCommand(id, options));
    }
};
exports.SoundshotController = SoundshotController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get paginated list of soundshots',
        description: 'Retrieves a paginated list of soundshots with optional filtering and sorting capabilities.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'params',
        type: (core_1.BaseQueryDTO),
        required: false,
        description: 'Pagination and filtering parameters for soundshots. Supports filtering by tenant, organization, and other soundshot properties.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Soundshots successfully fetched.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User is not authorized to access soundshots.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User does not have permission to list soundshots.'
    }),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [get_soundshots_query_dto_1.GetSoundshotsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], SoundshotController.prototype, "list", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create soundshot',
        description: 'This API Endpoint allows uploading the soundshot file along with related metadata.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Soundshot created successfully.',
        type: soundshot_entity_1.Soundshot
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
        storage: () => core_1.FileStorageFactory.create('soundshots'),
        // Soundshots are served unauthenticated from `/public/<key>` with a Content-Type derived from
        // the stored extension, and the DTO's `mimetype` is an unconstrained optional string — so an
        // `.svg`/`.html` upload would execute script in the app origin (GHSA-p334-cm7f-php5 class).
        fileFilter: core_1.audioUploadFileFilter
    })),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, core_1.UploadedFileStorage)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_soundshot_dto_1.CreateSoundshotDTO, file_dto_1.FileDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], SoundshotController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get soundshot count in the same tenant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the soundshot count.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid query parameters. Please check your input.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'An error occurred while retrieving the soundshot count.'
    }),
    (0, common_1.Get)('count'),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [count_soundshot_dto_1.CountSoundshotDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], SoundshotController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get soundshot by ID' }),
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
    tslib_1.__metadata("design:paramtypes", [String, core_1.FindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], SoundshotController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Recover a deleted soundshot',
        description: 'Soft-recovers a previously deleted soundshot using its UUID and the plugin ID.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        format: 'uuid',
        description: 'UUID of the soundshot to recover',
        required: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Soundshot recovered successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Soundshot record not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User does not have permission to recover this soundshot.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.'
    }),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SoundshotController.prototype, "recover", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a soundshot record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Soundshot successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input provided. Check the response body for error details.'
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
    tslib_1.__metadata("design:paramtypes", [String, delete_soundshot_dto_1.DeleteSoundshotDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], SoundshotController.prototype, "delete", null);
exports.SoundshotController = SoundshotController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Soundshot Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.TIME_TRACKER),
    (0, common_1.Controller)('/plugins/soundshots'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        soundshot_service_1.SoundshotService])
], SoundshotController);
//# sourceMappingURL=soundshot.controller.js.map