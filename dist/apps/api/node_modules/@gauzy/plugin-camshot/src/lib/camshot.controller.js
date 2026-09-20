"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamshotController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const create_camshot_command_1 = require("./commands/create-camshot.command");
const delete_camshot_command_1 = require("./commands/delete-camshot.command");
const count_camshot_dto_1 = require("./dtos/count-camshot.dto");
const create_camshot_dto_1 = require("./dtos/create-camshot.dto");
const delete_camshot_dto_1 = require("./dtos/delete-camshot.dto");
const file_dto_1 = require("./dtos/file.dto");
const camshot_entity_1 = require("./entity/camshot.entity");
const queries_1 = require("./queries");
const get_camshot_count_query_1 = require("./queries/get-camshot-count.query");
const get_camshot_query_1 = require("./queries/get-camshot.query");
const commands_1 = require("./commands");
let CamshotController = class CamshotController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * Get a paginated list of camshots.
     *
     * This endpoint allows authorized users to retrieve a paginated list of camshots with optional filtering and sorting.
     * The endpoint supports pagination, filtering, and sorting through the query parameters.
     *
     * @param params - Pagination and filtering parameters for camshots
     * @returns Promise<IPagination<ICamshot>> A Promise that resolves with the paginated list of camshots
     * @throws {UnauthorizedException} If the user is not authorized to access the camshots
     * @throws {ForbiddenException} If the user does not have permission to list camshots
     */
    async list(params) {
        return this.queryBus.execute(new queries_1.ListCamshotQuery(params));
    }
    /**
     * Create a new camshot record.
     *
     * This endpoint allows authorized users to create a new camshot record by providing the necessary metadata.
     * The camshot file should be uploaded as a form-data file with the key 'file'.
     *
     * @param input - The metadata for the camshot record.
     * @param file - The uploaded camshot file.
     * @returns A Promise that resolves with the details of the created camshot.
     */
    async create(input, file) {
        // Check if the file key is empty
        if (!file.key) {
            throw new common_1.BadRequestException('Camshot file key is empty');
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
        // Try to create a new camshot record
        try {
            // Create a new camshot record
            return this.commandBus.execute(new create_camshot_command_1.CreateCamshotCommand(input, file));
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
     * GET camshot count in the same tenant.
     *
     * This endpoint retrieves the count of camshots within a specific tenant.
     * It takes query parameters to filter the camshot count by certain criteria.
     *
     * @param options Query parameters to filter the camshot count.
     * @returns A promise resolving to the total count of camshots in the tenant.
     */
    async getCount(options) {
        return this.queryBus.execute(new get_camshot_count_query_1.GetCamshotCountQuery(options));
    }
    /**
     * Retrieves a camshot record by its ID.
     *
     * @param id - The UUID of the camshot to retrieve.
     * @param options - Additional query options for finding the camshot.
     * @returns A Promise that resolves with the details of the camshot.
     */
    async findById(id, options) {
        return this.queryBus.execute(new get_camshot_query_1.GetCamshotQuery(id, options));
    }
    /**
     * Recover a soft-deleted plugin source.
     */
    async recover(id) {
        return this.commandBus.execute(new commands_1.RecoverCamshotCommand(id));
    }
    /**
     * Delete a camshot record.
     *
     * This endpoint allows authorized users to delete a camshot record by providing the necessary ID.
     *
     * @param id - The ID of the camshot to be deleted.
     * @returns A promise resolving to the result of the deletion operation.
     */
    async delete(id, options) {
        await this.commandBus.execute(new delete_camshot_command_1.DeleteCamshotCommand(id, options));
    }
};
exports.CamshotController = CamshotController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get paginated list of camshots',
        description: 'Retrieves a paginated list of camshots with optional filtering and sorting capabilities.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'params',
        type: (core_1.BaseQueryDTO),
        required: false,
        description: 'Pagination and filtering parameters for camshots. Supports filtering by tenant, organization, and other camshot properties.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Camshots successfully fetched.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User is not authorized to access camshots.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User does not have permission to list camshots.'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CamshotController.prototype, "list", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create camshot',
        description: 'This API Endpoint allows uploading the camshot file along with related metadata.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Camshot created successfully.',
        type: camshot_entity_1.Camshot
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
        storage: () => core_1.FileStorageFactory.create('camshots'),
        // Camshots are served unauthenticated from `/public/<key>` with a Content-Type derived from
        // the stored extension. The DTO's `@Matches(/^image\/png$/)` only checks the client-supplied
        // client MIME and is optional, so an `.svg` upload would execute script in the app origin
        // (GHSA-p334-cm7f-php5 class).
        fileFilter: core_1.imageUploadFileFilter
    })),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, core_1.UploadedFileStorage)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [create_camshot_dto_1.CreateCamshotDTO, file_dto_1.FileDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CamshotController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get camshot count in the same tenant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved the camshot count.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid query parameters. Please check your input.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'An error occurred while retrieving the camshot count.'
    }),
    (0, common_1.Get)('count'),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [count_camshot_dto_1.CountCamshotDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CamshotController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get camshot by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Camshot successfully fetched by ID.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Camshot with the given ID not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'An error occurred while retrieving the camshot.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'options', type: core_1.FindOptionsQueryDTO, required: false }),
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
], CamshotController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Recover a deleted camshot',
        description: 'Soft-recovers a previously deleted camshot using its UUID, version UUID the plugin ID.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        format: 'uuid',
        description: 'UUID of the camshot to recover',
        required: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Camshot recovered successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Camshot record not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User does not have permission to recover this camshot.'
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
], CamshotController.prototype, "recover", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a camshot record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Camshot successfully deleted.'
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
    tslib_1.__metadata("design:paramtypes", [String, delete_camshot_dto_1.DeleteCamshotDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], CamshotController.prototype, "delete", null);
exports.CamshotController = CamshotController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Camshot Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.TIME_TRACKER),
    (0, common_1.Controller)('/plugins/camshots'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], CamshotController);
//# sourceMappingURL=camshot.controller.js.map