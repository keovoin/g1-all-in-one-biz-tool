"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const core_1 = require("@mikro-orm/core");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_language_repository_1 = require("./repository/mikro-orm-language.repository");
const utils_1 = require("../core/utils");
/**
 * Conditionally applies the appropriate Unique decorator based on the active ORM.
 * This prevents MikroORM metadata validation errors when TypeORM is the active ORM
 * (and vice versa), since MultiORMColumn only registers properties for the active ORM.
 */
function ConditionalUnique(properties) {
    return (target) => {
        const ormType = (0, utils_1.getORMType)();
        if (ormType === utils_1.MultiORMEnum.TypeORM) {
            (0, typeorm_1.Unique)(properties)(target);
        }
        if (ormType === utils_1.MultiORMEnum.MikroORM) {
            (0, core_1.Unique)({ properties })(target);
        }
    };
}
let Language = class Language extends internal_1.BaseEntity {
};
exports.Language = Language;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Language.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], Language.prototype, "code", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean, default: true }),
    (0, entity_1.MultiORMColumn)({ default: true, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], Language.prototype, "is_system", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Language.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Language.prototype, "color", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationLanguage, (it) => it.language, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Language.prototype, "organizationLanguages", void 0);
exports.Language = Language = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('language', { mikroOrmRepository: () => mikro_orm_language_repository_1.MikroOrmLanguageRepository }),
    ConditionalUnique(['code'])
], Language);
//# sourceMappingURL=language.entity.js.map