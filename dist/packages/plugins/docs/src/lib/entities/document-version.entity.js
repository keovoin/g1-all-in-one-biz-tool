"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentVersion = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const core_1 = require("@gauzy/core");
const mikro_orm_document_version_repository_1 = require("../repositories/mikro-orm-document-version.repository");
const column_types_1 = require("./column-types");
const document_entity_1 = require("./document.entity");
let DocumentVersion = class DocumentVersion extends core_1.TenantOrganizationBaseEntity {
};
exports.DocumentVersion = DocumentVersion;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], DocumentVersion.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, column_types_1.jsonColumnType)(), nullable: true }),
    tslib_1.__metadata("design:type", Object)
], DocumentVersion.prototype, "contentJson", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], DocumentVersion.prototype, "contentHtml", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => 'string', format: 'binary' }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, column_types_1.binaryColumnType)(), nullable: true }),
    tslib_1.__metadata("design:type", Buffer)
], DocumentVersion.prototype, "contentBinary", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsDateString)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], DocumentVersion.prototype, "lastSavedAt", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => document_entity_1.Document, (it) => it.versions, {
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], DocumentVersion.prototype, "document", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.document),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], DocumentVersion.prototype, "documentId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.Employee, {
        /** Specifies whether the relation column can have null values. */
        nullable: true,
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], DocumentVersion.prototype, "createdBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.createdBy),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], DocumentVersion.prototype, "createdById", void 0);
exports.DocumentVersion = DocumentVersion = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('document_version', { mikroOrmRepository: () => mikro_orm_document_version_repository_1.MikroOrmDocumentVersionRepository }),
    (0, core_1.ColumnIndex)('IDX_document_version_doc_saved', ['documentId', 'lastSavedAt'])
], DocumentVersion);
//# sourceMappingURL=document-version.entity.js.map