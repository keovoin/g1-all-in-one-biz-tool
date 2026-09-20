"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManagementController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const application_1 = require("../../application");
const core_2 = require("../../core");
const domain_1 = require("../../domain");
const shared_1 = require("../../shared");
const storage_1 = require("../storage");
let PluginManagementController = class PluginManagementController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * Creates a new plugin in the system.
     */
    async create(input, files) {
        try {
            // Validate files against sources
            this.validateFilesAgainstSources(input.version.sources, files);
            // Get the appropriate file storage provider
            const gauzyStorageProvider = new storage_1.GauzyStorageProvider(new core_1.FileStorage());
            // Process each source
            const sources = await Promise.all(input.version.sources.map(async (source) => {
                if (source.type === contracts_1.PluginSourceType.GAUZY) {
                    // Find matching file for this source
                    const file = this.findFileForSource(files, source);
                    if (!file?.key) {
                        throw new common_1.BadRequestException(`Plugin file key is empty for source: ${source.name}`);
                    }
                    // Validate and extract metadata
                    await gauzyStorageProvider.validate(file);
                    const metadata = gauzyStorageProvider.extractMetadata(file);
                    return {
                        ...source,
                        ...metadata
                    };
                }
                else {
                    return source;
                }
            }));
            return this.commandBus.execute(new application_1.CreatePluginCommand({
                ...input,
                version: {
                    ...input.version,
                    sources
                }
            }));
        }
        catch (error) {
            // Cleanup any uploaded files if error occurs
            if (files?.length > 0) {
                const gauzyStorageProvider = new storage_1.GauzyStorageProvider(new core_1.FileStorage());
                await Promise.all(files.map((file) => (file?.key ? gauzyStorageProvider.delete(file.key) : Promise.resolve())));
            }
            // Improved error handling
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(error.response?.message || error.message || 'Failed to create plugin');
        }
    }
    /**
     * Updates an existing plugin by ID.
     */
    async update(id, input, files) {
        try {
            // Validate files against sources
            this.validateFilesAgainstSources(input.version.sources, files);
            // Get the appropriate file storage provider
            const gauzyStorageProvider = new storage_1.GauzyStorageProvider(new core_1.FileStorage());
            // Process each source
            const sources = await Promise.all(input.version.sources.map(async (source) => {
                if (source.type === contracts_1.PluginSourceType.GAUZY) {
                    // Find matching file for this source
                    const file = this.findFileForSource(files, source);
                    if (!file?.key) {
                        throw new common_1.BadRequestException(`Plugin file key is empty for source: ${source.name}`);
                    }
                    // Validate and extract metadata
                    await gauzyStorageProvider.validate(file);
                    const metadata = gauzyStorageProvider.extractMetadata(file);
                    return {
                        ...source,
                        ...metadata
                    };
                }
                else {
                    return source;
                }
            }));
            return this.commandBus.execute(new application_1.UpdatePluginCommand(id, {
                ...input,
                version: {
                    ...input.version,
                    sources
                }
            }));
        }
        catch (error) {
            // Cleanup any uploaded files if error occurs
            if (files?.length > 0) {
                const gauzyStorageProvider = new storage_1.GauzyStorageProvider(new core_1.FileStorage());
                await Promise.all(files.map((file) => (file?.key ? gauzyStorageProvider.delete(file.key) : Promise.resolve())));
            }
            // Improved error handling
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(error.response?.message || error.message || 'Failed to create plugin');
        }
    }
    /**
     * Validate that files match the required sources
     */
    validateFilesAgainstSources(sources, files) {
        const gauzySources = sources.filter((s) => s.type === contracts_1.PluginSourceType.GAUZY);
        // Check file count matches GAUZY sources count
        if (gauzySources.length > 0 && (!files || files.length < gauzySources.length)) {
            throw new common_1.BadRequestException(`Expected ${gauzySources.length} files for GAUZY sources, got ${files?.length || 0}`);
        }
    }
    /**
     * Find the appropriate file for a given source
     */
    findFileForSource(files, source) {
        // Implement your matching logic here
        // This could be based on filename, metadata, or other criteria
        return files.find((file) => file.originalname.includes(source.fileName));
    }
    /**
     * Partially updates an existing plugin by ID.
     */
    async partialUpdate(id, input) {
        return this.commandBus.execute(new application_1.UpdatePluginCommand(id, input));
    }
    /**
     * Deletes a plugin by ID.
     */
    async delete(id) {
        return this.commandBus.execute(new application_1.DeletePluginCommand(id));
    }
    /**
     * Retrieves plugin tenant ID for a specific plugin.
     * If the plugin tenant doesn't exist, it will be created.
     */
    async getPluginTenant(id) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        return this.queryBus.execute(new application_1.GetPluginTenantByPluginQuery(id, tenantId, organizationId));
    }
};
exports.PluginManagementController = PluginManagementController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create new plugin',
        description: 'Uploads a plugin file along with metadata to register a new plugin in the system.'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        type: shared_1.CreatePluginDTO,
        description: 'Plugin metadata and file'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.CREATED,
        description: 'Plugin created successfully.',
        type: domain_1.Plugin
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input provided. Check the response body for error details.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.'
    }),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    (0, common_1.UseInterceptors)((0, core_2.LazyAnyFileInterceptor)({
        storage: () => core_1.FileStorageFactory.create('plugins'),
        // Plugin archives land under /public with the client extension: refuse script-capable
        // non-document types (GHSA-p334-cm7f-php5 class).
        fileFilter: core_1.documentUploadFileFilter
    })),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, storage_1.UploadedPluginStorage)({ multiple: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [shared_1.CreatePluginDTO, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginManagementController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update plugin',
        description: 'Updates an existing plugin record based on the provided ID and metadata.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        format: 'uuid',
        description: 'UUID of the plugin to update',
        required: true
    }),
    (0, swagger_1.ApiBody)({
        type: shared_1.UpdatePluginDTO,
        description: 'Updated plugin metadata'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.OK,
        description: 'Plugin updated successfully.',
        type: domain_1.Plugin
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.NOT_FOUND,
        description: 'Plugin record not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input provided. Check the response body for error details.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.'
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    (0, common_1.UseInterceptors)((0, core_2.LazyAnyFileInterceptor)({
        storage: () => core_1.FileStorageFactory.create('plugins'),
        // Plugin archives land under /public with the client extension: refuse script-capable
        // non-document types (GHSA-p334-cm7f-php5 class).
        fileFilter: core_1.documentUploadFileFilter
    })),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_UPDATE),
    (0, common_1.UseGuards)(core_2.PluginOwnerGuard),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, storage_1.UploadedPluginStorage)({ multiple: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.UpdatePluginDTO, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginManagementController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Partially update plugin',
        description: 'Partially updates an existing plugin record with only the provided fields.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        format: 'uuid',
        description: 'UUID of the plugin to update',
        required: true
    }),
    (0, swagger_1.ApiBody)({
        type: shared_1.UpdatePluginDTO,
        description: 'Partial plugin metadata to update'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.OK,
        description: 'Plugin updated successfully.',
        type: domain_1.Plugin
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.NOT_FOUND,
        description: 'Plugin record not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input provided. Check the response body for error details.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.'
    }),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_UPDATE),
    (0, common_1.UseGuards)(core_2.PluginOwnerGuard),
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginManagementController.prototype, "partialUpdate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete plugin',
        description: 'Permanently removes a plugin from the system based on the provided ID.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        format: 'uuid',
        description: 'UUID of the plugin to delete',
        required: true
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.OK,
        description: 'Plugin deleted successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.NOT_FOUND,
        description: 'Plugin record not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.FORBIDDEN,
        description: 'User does not have permission to delete this plugin.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.'
    }),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_DELETE),
    (0, common_1.UseGuards)(core_2.PluginOwnerGuard),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginManagementController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get plugin tenant by plugin ID',
        description: 'Retrieves or creates a plugin tenant relationship for a specific plugin. Returns the plugin tenant ID.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        format: 'uuid',
        description: 'UUID of the plugin',
        required: true
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.OK,
        description: 'Plugin tenant retrieved or created successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.NOT_FOUND,
        description: 'Plugin not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input provided.'
    }),
    (0, common_1.Get)(':id/tenant'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginManagementController.prototype, "getPluginTenant", null);
exports.PluginManagementController = PluginManagementController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Management'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiSecurity)('api_key'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Controller)('/plugins'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], PluginManagementController);
//# sourceMappingURL=plugin-management.controller.js.map