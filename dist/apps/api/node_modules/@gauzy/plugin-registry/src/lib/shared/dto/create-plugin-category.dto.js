"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginCategoryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreatePluginCategoryDTO {
}
exports.CreatePluginCategoryDTO = CreatePluginCategoryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category name',
        example: 'Authentication',
        minLength: 2,
        maxLength: 100
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2, { message: 'Category name must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Category name must not exceed 100 characters' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    tslib_1.__metadata("design:type", String)
], CreatePluginCategoryDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category description',
        example: 'Plugins for authentication and authorization',
        maxLength: 500
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Description must not exceed 500 characters' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    tslib_1.__metadata("design:type", String)
], CreatePluginCategoryDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category slug for URL-friendly identification',
        example: 'authentication',
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug must contain only lowercase letters, numbers, and hyphens'
    }),
    (0, class_validator_1.MaxLength)(50, { message: 'Slug must not exceed 50 characters' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginCategoryDTO.prototype, "slug", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category color for UI representation',
        example: '#007bff',
        pattern: '^#[0-9a-fA-F]{6}$'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9a-fA-F]{6}$/, {
        message: 'Color must be a valid hex color code (e.g., #007bff)'
    }),
    tslib_1.__metadata("design:type", String)
], CreatePluginCategoryDTO.prototype, "color", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category icon identifier',
        example: 'fas fa-shield-alt',
        maxLength: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Icon must not exceed 50 characters' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginCategoryDTO.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Display order for sorting',
        example: 1,
        minimum: 0,
        maximum: 9999
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Order must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Order must be at least 0' }),
    (0, class_validator_1.Max)(9999, { message: 'Order must not exceed 9999' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? parseInt(value, 10) : 0)),
    tslib_1.__metadata("design:type", Number)
], CreatePluginCategoryDTO.prototype, "order", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the category is active',
        example: true,
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    tslib_1.__metadata("design:type", Boolean)
], CreatePluginCategoryDTO.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parent category ID for hierarchical structure',
        example: 'uuid-string'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Parent ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginCategoryDTO.prototype, "parentId", void 0);
//# sourceMappingURL=create-plugin-category.dto.js.map