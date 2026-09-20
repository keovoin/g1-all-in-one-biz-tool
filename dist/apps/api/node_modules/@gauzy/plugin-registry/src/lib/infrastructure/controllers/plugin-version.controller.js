"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginVersionController = void 0;
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
let PluginVersionController = class PluginVersionController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    async findAllVersions(id, params) {
        return this.queryBus.execute(new application_1.ListPluginVersionsQuery(id, params));
    }
    async createVersion(id, input, files) {
        try {
            // Validate files against sources
            this.validateFilesAgainstSources(input.sources, files);
            // Get the appropriate file storage provider
            const gauzyStorageProvider = new storage_1.GauzyStorageProvider(new core_1.FileStorage());
            // Process each source
            const sources = await Promise.all(input.sources.map(async (source) => {
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
            return this.commandBus.execute(new application_1.CreatePluginVersionCommand(id, {
                ...input,
                sources
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
     * Updates an existing plugin version by IDs.
     */
    async update(versionId, pluginId, input, files) {
        try {
            // Validate files against sources
            this.validateFilesAgainstSources(input.sources, files);
            // Get the appropriate file storage provider
            const gauzyStorageProvider = new storage_1.GauzyStorageProvider(new core_1.FileStorage());
            // Process each source
            const sources = await Promise.all(input.sources.map(async (source) => {
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
            return this.commandBus.execute(new application_1.UpdatePluginVersionCommand(pluginId, versionId, { ...input, sources }));
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
     * Update plugin version status (including restoration)
     */
    async updateStatus(versionId, pluginId, updateDto) {
        if (updateDto.status === 'restored') {
            return this.commandBus.execute(new application_1.RecoverPluginVersionCommand(versionId, pluginId));
        }
        // Handle other status updates as needed
        // Note: Implement appropriate command handling for other statuses
        throw new Error(`Status '${updateDto.status}' update not implemented yet`);
    }
    /**
     * Deletes a plugin by ID.
     */
    async delete(versionId, pluginId) {
        return this.commandBus.execute(new application_1.DeletePluginVersionCommand(versionId, pluginId));
    }
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
        // This could be based on filename, metadata, or other criteria
        return files.find((file) => file.originalname.includes(source.fileName));
    }
};
exports.PluginVersionController = PluginVersionController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List all plugin versions' }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.OK,
        description: 'List of plugin versions retrieved successfully.',
        type: shared_1.PluginVersionDTO,
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.NOT_FOUND,
        description: 'No plugin versions found matching the provided criteria.'
    }),
    (0, swagger_1.ApiResponse)({ status: contracts_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginVersionController.prototype, "findAllVersions", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new plugin version' }),
    (0, swagger_1.ApiParam)({
        name: 'pluginId',
        type: 'string',
        format: 'uuid',
        description: 'The UUID of the plugin for which a new version is being created.'
    }),
    (0, swagger_1.ApiBody)({ type: shared_1.PluginVersionDTO, description: 'The data required to create a new plugin version.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Plugin version successfully created.', type: shared_1.PluginVersionDTO }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Validation failed.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Plugin not found.' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.UseInterceptors)((0, core_2.LazyAnyFileInterceptor)({
        storage: () => core_1.FileStorageFactory.create('plugins'),
        // Plugin archives land under /public with the client extension: refuse script-capable
        // non-document types (GHSA-p334-cm7f-php5 class).
        fileFilter: core_1.documentUploadFileFilter
    })),
    (0, common_1.UseGuards)(core_2.PluginOwnerGuard, core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, storage_1.UploadedPluginStorage)({ multiple: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.PluginVersionDTO, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginVersionController.prototype, "createVersion", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update plugin version',
        description: 'Updates an existing plugin version record based on the provided ID and metadata.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'versionId',
        type: String,
        format: 'uuid',
        description: 'UUID of the plugin version to update',
        required: true
    }),
    (0, swagger_1.ApiBody)({
        type: shared_1.UpdatePluginVersionDTO,
        description: 'Updated plugin version data transfer object'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.OK,
        description: 'Plugin version updated successfully.',
        type: domain_1.PluginVersion
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.NOT_FOUND,
        description: 'Plugin version record not found.'
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
    (0, common_1.UseGuards)(core_2.PluginOwnerGuard, core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Put)(':versionId'),
    tslib_1.__param(0, (0, common_1.Param)('versionId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__param(3, (0, storage_1.UploadedPluginStorage)({ multiple: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, shared_1.UpdatePluginVersionDTO, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginVersionController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update plugin version status',
        description: 'Updates a plugin version status, including restoring deleted versions.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'pluginId',
        type: String,
        format: 'uuid',
        description: 'UUID of the plugin to which the version belongs',
        required: true
    }),
    (0, swagger_1.ApiParam)({
        name: 'versionId',
        type: String,
        format: 'uuid',
        description: 'UUID of the plugin version to update',
        required: true
    }),
    (0, swagger_1.ApiBody)({
        description: 'Status update data',
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['active', 'inactive', 'deleted', 'restored'],
                    description: 'The new status for the plugin version'
                }
            },
            required: ['status']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.OK,
        description: 'Plugin version status updated successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.NOT_FOUND,
        description: 'Plugin version record not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.FORBIDDEN,
        description: 'User does not have permission to update this plugin version.'
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
    (0, common_1.UseGuards)(core_2.PluginOwnerGuard, core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Patch)(':versionId/status'),
    tslib_1.__param(0, (0, common_1.Param)('versionId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginVersionController.prototype, "updateStatus", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete plugin',
        description: 'Soft removes a plugin version from the system based on the provided ID.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        format: 'uuid',
        description: 'UUID of the plugin version to delete',
        required: true
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.OK,
        description: 'Plugin version deleted successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.NOT_FOUND,
        description: 'Plugin version record not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.FORBIDDEN,
        description: 'User does not have permission to delete this plugin version.'
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
    (0, common_1.UseGuards)(core_2.PluginOwnerGuard, core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Delete)(':versionId'),
    tslib_1.__param(0, (0, common_1.Param)('versionId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginVersionController.prototype, "delete", null);
exports.PluginVersionController = PluginVersionController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Versions'),
    (0, common_1.Controller)('/plugins/:pluginId/versions'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], PluginVersionController);
//# sourceMappingURL=plugin-version.controller.js.map