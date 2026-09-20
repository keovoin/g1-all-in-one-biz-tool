"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentShare = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const mikro_orm_document_share_repository_1 = require("../repositories/mikro-orm-document-share.repository");
const document_entity_1 = require("./document.entity");
let DocumentShare = class DocumentShare extends core_1.TenantOrganizationBaseEntity {
};
exports.DocumentShare = DocumentShare;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DocumentShareAccessEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentShareAccessEnum),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 16, default: contracts_1.DocumentShareAccessEnum.VIEW }),
    tslib_1.__metadata("design:type", String)
], DocumentShare.prototype, "access", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => document_entity_1.Document, (it) => it.shares, {
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], DocumentShare.prototype, "document", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.document),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], DocumentShare.prototype, "documentId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.Employee, {
        /** Specifies whether the relation column can have null values. */
        nullable: true,
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], DocumentShare.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], DocumentShare.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.OrganizationTeam, {
        /** Specifies whether the relation column can have null values. */
        nullable: true,
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], DocumentShare.prototype, "team", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.team),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], DocumentShare.prototype, "teamId", void 0);
exports.DocumentShare = DocumentShare = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('document_share', { mikroOrmRepository: () => mikro_orm_document_share_repository_1.MikroOrmDocumentShareRepository }),
    (0, core_1.ColumnIndex)('IDX_document_share_tenant_org_doc', ['tenantId', 'organizationId', 'documentId'])
], DocumentShare);
//# sourceMappingURL=document-share.entity.js.map