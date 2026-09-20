"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentChunk = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const core_1 = require("@gauzy/core");
const mikro_orm_document_chunk_repository_1 = require("../repositories/mikro-orm-document-chunk.repository");
const document_entity_1 = require("./document.entity");
let DocumentChunk = class DocumentChunk extends core_1.TenantOrganizationBaseEntity {
};
exports.DocumentChunk = DocumentChunk;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], DocumentChunk.prototype, "chunkIndex", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ type: 'text' }),
    tslib_1.__metadata("design:type", String)
], DocumentChunk.prototype, "content", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: 'simple-json', nullable: true }),
    tslib_1.__metadata("design:type", Array)
], DocumentChunk.prototype, "embedding", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], DocumentChunk.prototype, "tokenCount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: 'simple-json', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], DocumentChunk.prototype, "metadata", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => document_entity_1.Document, {
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", document_entity_1.Document)
], DocumentChunk.prototype, "document", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.document),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], DocumentChunk.prototype, "documentId", void 0);
exports.DocumentChunk = DocumentChunk = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('document_chunk', { mikroOrmRepository: () => mikro_orm_document_chunk_repository_1.MikroOrmDocumentChunkRepository }),
    (0, core_1.ColumnIndex)('IDX_document_chunk_tenant_org_doc', ['tenantId', 'organizationId', 'documentId', 'chunkIndex'], {
        unique: true
    })
], DocumentChunk);
//# sourceMappingURL=document-chunk.entity.js.map