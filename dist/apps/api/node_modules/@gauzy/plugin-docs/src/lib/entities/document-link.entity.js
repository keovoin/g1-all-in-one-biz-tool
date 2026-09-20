"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentLink = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const mikro_orm_document_link_repository_1 = require("../repositories/mikro-orm-document-link.repository");
const column_types_1 = require("./column-types");
const document_entity_1 = require("./document.entity");
let DocumentLink = class DocumentLink extends core_1.TenantOrganizationBaseEntity {
};
exports.DocumentLink = DocumentLink;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.BaseEntityEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.BaseEntityEnum),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 50 }),
    tslib_1.__metadata("design:type", String)
], DocumentLink.prototype, "entity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], DocumentLink.prototype, "entityId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, column_types_1.jsonColumnType)(), nullable: true }),
    tslib_1.__metadata("design:type", Object)
], DocumentLink.prototype, "metadata", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => document_entity_1.Document, (it) => it.links, {
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], DocumentLink.prototype, "document", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.document),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], DocumentLink.prototype, "documentId", void 0);
exports.DocumentLink = DocumentLink = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('document_link', { mikroOrmRepository: () => mikro_orm_document_link_repository_1.MikroOrmDocumentLinkRepository }),
    (0, core_1.ColumnIndex)('IDX_document_link_unique', ['documentId', 'entity', 'entityId'], { unique: true }),
    (0, core_1.ColumnIndex)('IDX_document_link_tenant_org_entity', ['tenantId', 'organizationId', 'entity', 'entityId']),
    (0, core_1.ColumnIndex)('IDX_document_link_tenant_org_doc', ['tenantId', 'organizationId', 'documentId'])
], DocumentLink);
//# sourceMappingURL=document-link.entity.js.map