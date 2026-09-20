"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDocument = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_organization_document_repository_1 = require("./repository/mikro-orm-organization-document.repository");
let OrganizationDocument = class OrganizationDocument extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationDocument = OrganizationDocument;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationDocument.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationDocument.prototype, "documentUrl", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.ImageAsset, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'SET NULL',
        /** Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods. */
        eager: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], OrganizationDocument.prototype, "document", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.document),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], OrganizationDocument.prototype, "documentId", void 0);
exports.OrganizationDocument = OrganizationDocument = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_document', { mikroOrmRepository: () => mikro_orm_organization_document_repository_1.MikroOrmOrganizationDocumentRepository })
], OrganizationDocument);
//# sourceMappingURL=organization-document.entity.js.map