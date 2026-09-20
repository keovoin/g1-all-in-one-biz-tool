"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSearchFilterDTO = exports.PLUGIN_SORT_DIRECTIONS = exports.PLUGIN_SORTABLE_FIELDS = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const utils_1 = require("@gauzy/utils");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * Allowlist of columns that may be used in the SQL `ORDER BY` clause.
 * MUST stay in sync with the columns interpolated by SearchPluginsQueryHandler.
 * Keeping this as a runtime `@IsIn` check (not just the compile-time union below)
 * is what prevents SQL injection via the `sortBy` parameter.
 */
exports.PLUGIN_SORTABLE_FIELDS = [
    'name',
    'author',
    'uploadedAt',
    'lastDownloadedAt',
    'downloadCount',
    'createdAt',
    'updatedAt'
];
/** Allowed SQL sort directions. */
exports.PLUGIN_SORT_DIRECTIONS = ['ASC', 'DESC'];
/**
 * DTO for plugin search and filtering functionality
 */
class PluginSearchFilterDTO extends (0, swagger_1.PartialType)((core_1.BaseQueryDTO)) {
}
exports.PluginSearchFilterDTO = PluginSearchFilterDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search text to filter plugins by name, description, or author',
        example: 'time tracking'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginSearchFilterDTO.prototype, "search", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by plugin name (exact match)',
        example: 'Gauzy Time Tracker'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginSearchFilterDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by plugin description (partial match)',
        example: 'track time'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginSearchFilterDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by plugin type',
        enum: contracts_1.PluginType,
        example: contracts_1.PluginType.DESKTOP
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginType),
    tslib_1.__metadata("design:type", String)
], PluginSearchFilterDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by plugin status',
        enum: contracts_1.PluginStatus,
        example: contracts_1.PluginStatus.ACTIVE
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginStatus),
    tslib_1.__metadata("design:type", String)
], PluginSearchFilterDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by active state',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, utils_1.parseToBoolean)(value)),
    tslib_1.__metadata("design:type", Boolean)
], PluginSearchFilterDTO.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by plugin category ID',
        example: 'uuid-string'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Category ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], PluginSearchFilterDTO.prototype, "categoryId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by plugin author',
        example: 'Gauzy Team'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginSearchFilterDTO.prototype, "author", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by plugin license',
        example: 'MIT'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginSearchFilterDTO.prototype, "license", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by user who uploaded the plugin',
        example: 'uuid-string'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Uploaded by ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], PluginSearchFilterDTO.prototype, "uploadedById", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter plugins uploaded after this date',
        example: '2024-01-01T00:00:00.000Z'
    }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Date)
], PluginSearchFilterDTO.prototype, "uploadedAfter", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter plugins uploaded before this date',
        example: '2024-12-31T23:59:59.999Z'
    }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Date)
], PluginSearchFilterDTO.prototype, "uploadedBefore", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter plugins downloaded after this date',
        example: '2024-01-01T00:00:00.000Z'
    }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Date)
], PluginSearchFilterDTO.prototype, "downloadedAfter", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter plugins downloaded before this date',
        example: '2024-12-31T23:59:59.999Z'
    }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Date)
], PluginSearchFilterDTO.prototype, "downloadedBefore", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by minimum download count',
        example: 10,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Minimum downloads must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Minimum downloads must be at least 0' }),
    tslib_1.__metadata("design:type", Number)
], PluginSearchFilterDTO.prototype, "minDownloads", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by maximum download count',
        example: 1000,
        minimum: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Maximum downloads must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Maximum downloads must be at least 0' }),
    tslib_1.__metadata("design:type", Number)
], PluginSearchFilterDTO.prototype, "maxDownloads", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by version number',
        example: '1.0.0'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginSearchFilterDTO.prototype, "version", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by plugin tags',
        example: ['time-tracking', 'productivity'],
        type: [String]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], PluginSearchFilterDTO.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include only plugins with installations',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, utils_1.parseToBoolean)(value)),
    tslib_1.__metadata("design:type", Boolean)
], PluginSearchFilterDTO.prototype, "hasInstallations", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include only verified plugins',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, utils_1.parseToBoolean)(value)),
    tslib_1.__metadata("design:type", Boolean)
], PluginSearchFilterDTO.prototype, "isVerified", void 0);
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
], PluginSearchFilterDTO.prototype, "page", void 0);
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
], PluginSearchFilterDTO.prototype, "limit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort field',
        example: 'name',
        enum: exports.PLUGIN_SORTABLE_FIELDS
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.PLUGIN_SORTABLE_FIELDS),
    tslib_1.__metadata("design:type", Object)
], PluginSearchFilterDTO.prototype, "sortBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort direction',
        example: 'ASC',
        enum: exports.PLUGIN_SORT_DIRECTIONS
    }),
    (0, class_validator_1.IsOptional)()
    // Normalize case so legacy clients sending `asc`/`desc` keep working, then enforce the allowlist.
    ,
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.toUpperCase() : value)),
    (0, class_validator_1.IsIn)(exports.PLUGIN_SORT_DIRECTIONS),
    tslib_1.__metadata("design:type", Object)
], PluginSearchFilterDTO.prototype, "sortDirection", void 0);
//# sourceMappingURL=plugin-search-filter.dto.js.map