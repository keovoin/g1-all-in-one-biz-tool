"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_feature_repository_1 = require("./repository/mikro-orm-feature.repository");
let Feature = class Feature extends internal_1.BaseEntity {
};
exports.Feature = Feature;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Feature.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Feature.prototype, "code", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean, default: false }),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Feature.prototype, "isPaid", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Feature.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Feature.prototype, "image", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Feature.prototype, "link", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Feature.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Feature.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], Feature.prototype, "isEnabled", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", String)
], Feature.prototype, "imageUrl", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => Feature, (it) => it.children, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], Feature.prototype, "parent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.parent),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Feature.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.FeatureOrganization, (it) => it.feature, {
        cascade: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Feature.prototype, "featureOrganizations", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => Feature, (it) => it.parent, {
        cascade: true
    }),
    (0, typeorm_1.JoinColumn)({ name: 'parentId' }),
    tslib_1.__metadata("design:type", Array)
], Feature.prototype, "children", void 0);
exports.Feature = Feature = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('feature', { mikroOrmRepository: () => mikro_orm_feature_repository_1.MikroOrmFeatureRepository })
], Feature);
//# sourceMappingURL=feature.entity.js.map