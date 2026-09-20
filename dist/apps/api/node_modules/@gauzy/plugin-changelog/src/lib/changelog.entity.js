"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Changelog = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
const mikro_orm_changelog_repository_1 = require("./repository/mikro-orm-changelog.repository");
let Changelog = class Changelog extends core_1.TenantOrganizationBaseEntity {
};
exports.Changelog = Changelog;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Changelog.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Changelog.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], Changelog.prototype, "date", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Changelog.prototype, "content", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ type: Boolean, nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Changelog.prototype, "isFeature", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Changelog.prototype, "learnMoreUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Changelog.prototype, "imageUrl", void 0);
exports.Changelog = Changelog = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('changelog', { mikroOrmRepository: () => mikro_orm_changelog_repository_1.MikroOrmChangelogRepository })
], Changelog);
//# sourceMappingURL=changelog.entity.js.map