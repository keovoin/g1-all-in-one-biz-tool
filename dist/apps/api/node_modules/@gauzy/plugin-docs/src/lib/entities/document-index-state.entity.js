"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentIndexState = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const core_1 = require("@gauzy/core");
const mikro_orm_document_index_state_repository_1 = require("../repositories/mikro-orm-document-index-state.repository");
const document_entity_1 = require("./document.entity");
let DocumentIndexState = class DocumentIndexState extends core_1.TenantOrganizationBaseEntity {
};
exports.DocumentIndexState = DocumentIndexState;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 100 }),
    tslib_1.__metadata("design:type", String)
], DocumentIndexState.prototype, "embeddingModel", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], DocumentIndexState.prototype, "embeddingDims", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, core_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], DocumentIndexState.prototype, "chunkCount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsDateString)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], DocumentIndexState.prototype, "lastIndexedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 64 }),
    tslib_1.__metadata("design:type", String)
], DocumentIndexState.prototype, "contentHash", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => document_entity_1.Document, {
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", document_entity_1.Document)
], DocumentIndexState.prototype, "document", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.document),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], DocumentIndexState.prototype, "documentId", void 0);
exports.DocumentIndexState = DocumentIndexState = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('document_index_state', { mikroOrmRepository: () => mikro_orm_document_index_state_repository_1.MikroOrmDocumentIndexStateRepository }),
    (0, core_1.ColumnIndex)('IDX_document_index_state_document', ['documentId'], { unique: true }),
    (0, core_1.ColumnIndex)('IDX_document_index_state_model', ['tenantId', 'organizationId', 'embeddingModel'])
], DocumentIndexState);
//# sourceMappingURL=document-index-state.entity.js.map