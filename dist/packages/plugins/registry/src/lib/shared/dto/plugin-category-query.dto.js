"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginCategoryQueryDTO = exports.PLUGIN_CATEGORY_SORT_DIRECTIONS = exports.PLUGIN_CATEGORY_SORTABLE_FIELDS = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
/** Allowlist of columns that may appear in the SQL `ORDER BY` clause (prevents `sortBy` injection). */
exports.PLUGIN_CATEGORY_SORTABLE_FIELDS = ['name', 'slug', 'order', 'createdAt', 'updatedAt'];
/** Allowed SQL sort directions. */
exports.PLUGIN_CATEGORY_SORT_DIRECTIONS = ['ASC', 'DESC'];
class PluginCategoryQueryDTO {
}
exports.PluginCategoryQueryDTO = PluginCategoryQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by category name',
        example: 'Authentication'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginCategoryQueryDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by category slug',
        example: 'authentication'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginCategoryQueryDTO.prototype, "slug", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by active status',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    tslib_1.__metadata("design:type", Boolean)
], PluginCategoryQueryDTO.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by parent category ID',
        example: 'uuid-string'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Parent ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], PluginCategoryQueryDTO.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Page must be a valid number' }),
    (0, class_validator_1.Min)(1, { message: 'Page must be at least 1' }),
    tslib_1.__metadata("design:type", Number)
], PluginCategoryQueryDTO.prototype, "page", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        example: 10,
        minimum: 1,
        maximum: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Limit must be a valid number' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit must not exceed 100' }),
    tslib_1.__metadata("design:type", Number)
], PluginCategoryQueryDTO.prototype, "limit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort field',
        example: 'name',
        enum: exports.PLUGIN_CATEGORY_SORTABLE_FIELDS
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.PLUGIN_CATEGORY_SORTABLE_FIELDS),
    tslib_1.__metadata("design:type", Object)
], PluginCategoryQueryDTO.prototype, "sortBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort direction',
        example: 'ASC',
        enum: exports.PLUGIN_CATEGORY_SORT_DIRECTIONS
    }),
    (0, class_validator_1.IsOptional)()
    // Normalize case so legacy clients sending `asc`/`desc` keep working, then enforce the allowlist.
    ,
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.toUpperCase() : value)),
    (0, class_validator_1.IsIn)(exports.PLUGIN_CATEGORY_SORT_DIRECTIONS),
    tslib_1.__metadata("design:type", Object)
], PluginCategoryQueryDTO.prototype, "sortDirection", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Relations to include',
        example: ['parent', 'children', 'plugins'],
        type: [String]
    }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Array)
], PluginCategoryQueryDTO.prototype, "relations", void 0);
//# sourceMappingURL=plugin-category-query.dto.js.map