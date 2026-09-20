"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginCategoryController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const application_1 = require("../../application");
const shared_1 = require("../../shared");
let PluginCategoryController = class PluginCategoryController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * Create a new plugin category
     */
    async create(input) {
        // Ensure order has a default value if not provided
        const inputWithDefaults = {
            ...input,
            order: input.order ?? 0,
            isActive: input.isActive ?? true
        };
        return this.commandBus.execute(new application_1.CreatePluginCategoryCommand(inputWithDefaults));
    }
    /**
     * Get all plugin categories with optional tree format
     */
    async findAll(format, options) {
        if (format === 'tree') {
            return this.queryBus.execute(new application_1.GetPluginCategoryTreeQuery(options));
        }
        return this.queryBus.execute(new application_1.GetPluginCategoriesQuery(options));
    }
    /**
     * Get plugin category by ID
     */
    async findOne(id, relations) {
        return this.queryBus.execute(new application_1.GetPluginCategoryQuery(id, relations));
    }
    /**
     * Update plugin category (full replacement)
     */
    async update(id, input) {
        return this.commandBus.execute(new application_1.UpdatePluginCategoryCommand(id, input));
    }
    /**
     * Partially update plugin category
     */
    async partialUpdate(id, input) {
        return this.commandBus.execute(new application_1.UpdatePluginCategoryCommand(id, input));
    }
    /**
     * Delete plugin category
     */
    async delete(id) {
        await this.commandBus.execute(new application_1.DeletePluginCategoryCommand(id));
    }
};
exports.PluginCategoryController = PluginCategoryController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create plugin category' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Plugin category created successfully',
        type: 'IPluginCategory'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [shared_1.CreatePluginCategoryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginCategoryController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all plugin categories' }),
    (0, swagger_1.ApiQuery)({
        name: 'format',
        required: false,
        description: 'Response format (tree for hierarchical structure)',
        enum: ['tree', 'flat']
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin categories retrieved successfully'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('format')),
    tslib_1.__param(1, (0, common_1.Query)(new common_1.ValidationPipe({ whitelist: true, transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.PluginCategoryQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginCategoryController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get plugin category by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin category retrieved successfully'
    }),
    (0, common_2.Public)(),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('relations')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginCategoryController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update plugin category' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin category updated successfully'
    }),
    (0, common_1.Put)(':id'),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.UpdatePluginCategoryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginCategoryController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Partially update plugin category' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin category partially updated successfully'
    }),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginCategoryController.prototype, "partialUpdate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete plugin category' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Plugin category deleted successfully'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginCategoryController.prototype, "delete", null);
exports.PluginCategoryController = PluginCategoryController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Categories'),
    (0, common_1.Controller)('plugin-categories'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], PluginCategoryController);
//# sourceMappingURL=plugin-category.controller.js.map