"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const mikro_orm_document_repository_1 = require("../repositories/mikro-orm-document.repository");
const column_types_1 = require("./column-types");
const document_category_entity_1 = require("./document-category.entity");
const document_link_entity_1 = require("./document-link.entity");
const document_share_entity_1 = require("./document-share.entity");
const document_version_entity_1 = require("./document-version.entity");
let Document = class Document extends core_1.TenantOrganizationBaseEntity {
};
exports.Document = Document;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DocumentKindEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentKindEnum),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 16 }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "kind", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, description: 'Sibling sort order within the parent' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, core_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Document.prototype, "index", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Display name / page title' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 32, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "color", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 500, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, column_types_1.jsonColumnType)(), nullable: true }),
    tslib_1.__metadata("design:type", Object)
], Document.prototype, "contentJson", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "contentHtml", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => 'string', format: 'binary' }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, column_types_1.binaryColumnType)(), nullable: true }),
    tslib_1.__metadata("design:type", Buffer)
], Document.prototype, "contentBinary", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Document.prototype, "isLocked", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.FileStorageProviderEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.FileStorageProviderEnum),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 20, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "storageProvider", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1024),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 1024, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "storageKey", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1024),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 1024, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "thumbKey", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(127),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 127, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "mimeType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, core_1.MultiORMColumn)({
        type: (0, config_1.isPostgres)() || (0, config_1.isMySQL)() ? 'bigint' : 'integer',
        nullable: true,
        transformer: new core_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], Document.prototype, "fileSize", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() || (0, config_1.isMySQL)() ? 'char' : 'varchar', length: 64, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "sha256", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "originalFilename", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, core_1.MultiORMColumn)({ default: 1 }),
    tslib_1.__metadata("design:type", Number)
], Document.prototype, "version", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "extractedText", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Document.prototype, "extractedTextEdited", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "summary", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DocumentStatusEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentStatusEnum),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 16, default: contracts_1.DocumentStatusEnum.READY }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 500, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "statusMessage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DocumentSourceEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentSourceEnum),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 16, default: contracts_1.DocumentSourceEnum.UPLOAD }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "source", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DocumentKnowledgeStatusEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentKnowledgeStatusEnum),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 16, default: contracts_1.DocumentKnowledgeStatusEnum.NONE }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "knowledgeStatus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    (0, core_1.MultiORMColumn)({ type: (0, column_types_1.floatColumnType)(), nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Document.prototype, "aiConfidence", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Document.prototype, "searchable", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DocumentReviewStatusEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentReviewStatusEnum),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 16, default: contracts_1.DocumentReviewStatusEnum.NONE }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "reviewStatus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.DocumentReviewReasonEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentReviewReasonEnum),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 32, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "reviewReason", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Document.prototype, "reviewedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DocumentVisibilityEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentVisibilityEnum),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 16, default: contracts_1.DocumentVisibilityEnum.ORGANIZATION }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "visibility", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 64, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "externalSource", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "externalId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, column_types_1.jsonColumnType)(), nullable: true }),
    tslib_1.__metadata("design:type", Object)
], Document.prototype, "metadata", void 0);
tslib_1.__decorate([
    (0, core_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "fileUrl", void 0);
tslib_1.__decorate([
    (0, core_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "thumbUrl", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => Document, (it) => it.children, {
        /** Specifies whether the relation column can have null values. */
        nullable: true,
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Document.prototype, "parent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.parent),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.Employee, {
        /** Specifies whether the relation column can have null values. */
        nullable: true,
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Document.prototype, "reviewedBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.reviewedBy),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "reviewedById", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMOneToMany)(() => Document, (it) => it.parent),
    tslib_1.__metadata("design:type", Array)
], Document.prototype, "children", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMOneToMany)(() => document_version_entity_1.DocumentVersion, (it) => it.document, {
        /** Enables cascading persistence of versions with the document. */
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Document.prototype, "versions", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMOneToMany)(() => document_share_entity_1.DocumentShare, (it) => it.document),
    tslib_1.__metadata("design:type", Array)
], Document.prototype, "shares", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMOneToMany)(() => document_link_entity_1.DocumentLink, (it) => it.document),
    tslib_1.__metadata("design:type", Array)
], Document.prototype, "links", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToMany)(() => core_1.Tag, {
        /**  Database cascade action on update. */
        onUpdate: 'CASCADE',
        /** Database cascade action on delete. */
        onDelete: 'CASCADE',
        /** This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.  */
        owner: true,
        /** Pivot table for many-to-many relationship. */
        pivotTable: 'tag_document',
        /** Column in pivot table referencing 'document' primary key. */
        joinColumn: 'documentId',
        /** Column in pivot table referencing 'tag' primary key. */
        inverseJoinColumn: 'tagId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'tag_document' }),
    tslib_1.__metadata("design:type", Array)
], Document.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToMany)(() => document_category_entity_1.DocumentCategory, (it) => it.documents, {
        /**  Database cascade action on update. */
        onUpdate: 'CASCADE',
        /** Database cascade action on delete. */
        onDelete: 'CASCADE',
        /** This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.  */
        owner: true,
        /** Pivot table for many-to-many relationship. */
        pivotTable: 'document_category_document',
        /** Column in pivot table referencing 'document' primary key. */
        joinColumn: 'documentId',
        /** Column in pivot table referencing 'document_category' primary key. */
        inverseJoinColumn: 'documentCategoryId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'document_category_document' }),
    tslib_1.__metadata("design:type", Array)
], Document.prototype, "categories", void 0);
exports.Document = Document = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('document', { mikroOrmRepository: () => mikro_orm_document_repository_1.MikroOrmDocumentRepository }),
    (0, core_1.ColumnIndex)('IDX_document_tenant_org_parent', ['tenantId', 'organizationId', 'parentId', 'index']),
    (0, core_1.ColumnIndex)('IDX_document_tenant_org_updated', ['tenantId', 'organizationId', 'updatedAt']),
    (0, core_1.ColumnIndex)('IDX_document_tenant_org_kind', ['tenantId', 'organizationId', 'kind']),
    (0, core_1.ColumnIndex)('IDX_document_tenant_org_status', ['tenantId', 'organizationId', 'status']),
    (0, core_1.ColumnIndex)('IDX_document_tenant_org_knowledge', ['tenantId', 'organizationId', 'knowledgeStatus']),
    (0, core_1.ColumnIndex)('IDX_document_tenant_org_review', ['tenantId', 'organizationId', 'reviewStatus']),
    (0, core_1.ColumnIndex)('IDX_document_tenant_org_source', ['tenantId', 'organizationId', 'source']),
    (0, core_1.ColumnIndex)('IDX_document_tenant_org_visibility', ['tenantId', 'organizationId', 'visibility']),
    (0, core_1.ColumnIndex)('IDX_document_tenant_org_sha256', ['tenantId', 'organizationId', 'sha256'])
], Document);
//# sourceMappingURL=document.entity.js.map