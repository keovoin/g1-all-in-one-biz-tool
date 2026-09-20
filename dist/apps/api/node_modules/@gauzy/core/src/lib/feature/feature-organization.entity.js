"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureOrganization = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const internal_1 = require("../core/entities/internal");
const class_validator_1 = require("class-validator");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_feature_organization_repository_1 = require("./repository/mikro-orm-feature-organization.repository");
let FeatureOrganization = class FeatureOrganization extends internal_1.TenantOrganizationBaseEntity {
};
exports.FeatureOrganization = FeatureOrganization;
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], FeatureOrganization.prototype, "isEnabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Feature }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Feature, (it) => it.featureOrganizations, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], FeatureOrganization.prototype, "feature", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.feature),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", Object)
], FeatureOrganization.prototype, "featureId", void 0);
exports.FeatureOrganization = FeatureOrganization = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('feature_organization', { mikroOrmRepository: () => mikro_orm_feature_organization_repository_1.MikroOrmFeatureOrganizationRepository })
], FeatureOrganization);
//# sourceMappingURL=feature-organization.entity.js.map