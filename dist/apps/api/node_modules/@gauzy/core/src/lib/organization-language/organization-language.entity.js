"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationLanguage = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_organization_language_repository_1 = require("./repository/mikro-orm-organization-language.repository");
let OrganizationLanguage = class OrganizationLanguage extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationLanguage = OrganizationLanguage;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Language }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Language, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE',
        referenceColumnName: 'code',
        joinColumn: 'languageCode'
    }),
    (0, typeorm_1.JoinColumn)({ referencedColumnName: 'code' }),
    tslib_1.__metadata("design:type", internal_1.Language)
], OrganizationLanguage.prototype, "language", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.language),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationLanguage.prototype, "languageCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationLanguage.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationLanguage.prototype, "level", void 0);
exports.OrganizationLanguage = OrganizationLanguage = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_language', { mikroOrmRepository: () => mikro_orm_organization_language_repository_1.MikroOrmOrganizationLanguageRepository })
], OrganizationLanguage);
//# sourceMappingURL=organization-language.entity.js.map