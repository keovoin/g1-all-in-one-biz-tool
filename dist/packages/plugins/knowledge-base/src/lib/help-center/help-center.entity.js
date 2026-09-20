"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenter = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
const entities_1 = require("./../entities");
const mikro_orm_help_center_repository_1 = require("./repository/mikro-orm-help-center.repository");
let HelpCenter = class HelpCenter extends core_1.TenantOrganizationBaseEntity {
};
exports.HelpCenter = HelpCenter;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], HelpCenter.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], HelpCenter.prototype, "flag", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], HelpCenter.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], HelpCenter.prototype, "privacy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], HelpCenter.prototype, "language", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], HelpCenter.prototype, "color", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenter.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenter.prototype, "data", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], HelpCenter.prototype, "index", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => HelpCenter, (children) => children.children, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], HelpCenter.prototype, "parent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.parent),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenter.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMOneToMany)(() => HelpCenter, (children) => children.parent, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], HelpCenter.prototype, "children", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMOneToMany)(() => entities_1.HelpCenterArticle, (article) => article.category, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], HelpCenter.prototype, "articles", void 0);
exports.HelpCenter = HelpCenter = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('knowledge_base', { mikroOrmRepository: () => mikro_orm_help_center_repository_1.MikroOrmHelpCenterRepository })
], HelpCenter);
//# sourceMappingURL=help-center.entity.js.map