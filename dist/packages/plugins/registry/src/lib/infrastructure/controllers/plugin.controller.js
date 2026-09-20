"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_2 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const application_1 = require("../../application");
const domain_1 = require("../../domain");
const shared_1 = require("../../shared");
let PluginController = class PluginController {
    constructor(queryBus) {
        this.queryBus = queryBus;
    }
    /**
     * Retrieves a paginated list of plugins with optional filtering and search.
     */
    async findAll(params) {
        // If search parameters are provided, use search query, otherwise use list query
        if (params.search || params.type || params.status || params.categoryId || params.tags || params.author) {
            return this.queryBus.execute(new application_1.SearchPluginsQuery(params));
        }
        // Use simple base parameters for list query
        return this.queryBus.execute(new application_1.ListPluginsQuery(params));
    }
    /**
     * Retrieves a plugin by ID.
     */
    async findById(id, options) {
        return this.queryBus.execute(new application_1.GetPluginQuery(id, options));
    }
};
exports.PluginController = PluginController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'List all plugins with optional search and filtering',
        description: 'Retrieve a paginated list of plugins with optional filtering and search capabilities. Use query parameters for search, category, status, type filtering.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.OK,
        description: 'List of plugins retrieved successfully.',
        type: domain_1.Plugin,
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.NOT_FOUND,
        description: 'No plugins found matching the provided criteria.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid search or filter criteria provided.'
    }),
    (0, core_1.UseValidationPipe)({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }),
    (0, common_2.Get)(),
    tslib_1.__param(0, (0, common_2.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [shared_1.PluginSearchFilterDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get plugin by ID',
        description: 'Retrieves detailed information about a specific plugin by its UUID.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: String,
        format: 'uuid',
        description: 'UUID of the plugin to retrieve',
        required: true
    }),
    (0, swagger_1.ApiQuery)({
        name: 'relations',
        required: false,
        isArray: true,
        description: 'Entity relations to include in the response'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.OK,
        description: 'Plugin retrieved successfully.',
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
    (0, common_2.Get)(':id'),
    tslib_1.__param(0, (0, common_2.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_2.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.PluginQueryOptions]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginController.prototype, "findById", null);
exports.PluginController = PluginController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Registry'),
    (0, common_2.Controller)('/plugins'),
    (0, common_1.Public)(),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus])
], PluginController);
//# sourceMappingURL=plugin.controller.js.map