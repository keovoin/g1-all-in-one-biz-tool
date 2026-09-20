"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCategory = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
const mikro_orm_document_category_repository_1 = require("../repositories/mikro-orm-document-category.repository");
const document_entity_1 = require("./document.entity");
let DocumentCategory = class DocumentCategory extends core_1.TenantOrganizationBaseEntity {
};
exports.DocumentCategory = DocumentCategory;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 100 }),
    tslib_1.__metadata("design:type", String)
], DocumentCategory.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 150 }),
    tslib_1.__metadata("design:type", String)
], DocumentCategory.prototype, "slug", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 32, nullable: true }),
    tslib_1.__metadata("design:type", String)
], DocumentCategory.prototype, "color", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], DocumentCategory.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 500, nullable: true }),
    tslib_1.__metadata("design:type", String)
], DocumentCategory.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], DocumentCategory.prototype, "isSystem", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToMany)(() => document_entity_1.Document, (it) => it.categories),
    tslib_1.__metadata("design:type", Array)
], DocumentCategory.prototype, "documents", void 0);
exports.DocumentCategory = DocumentCategory = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('document_category', { mikroOrmRepository: () => mikro_orm_document_category_repository_1.MikroOrmDocumentCategoryRepository }),
    (0, core_1.ColumnIndex)('IDX_document_category_tenant_org_slug', ['tenantId', 'organizationId', 'slug'], { unique: true })
], DocumentCategory);
//# sourceMappingURL=document-category.entity.js.map