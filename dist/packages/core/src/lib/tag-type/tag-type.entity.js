"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_tag_type_repository_1 = require("./repository/mikro-orm-tag-type.repository");
let TagType = class TagType extends internal_1.TenantOrganizationBaseEntity {
};
exports.TagType = TagType;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], TagType.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => [internal_1.Tag], isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Tag, (tag) => tag.tagType),
    tslib_1.__metadata("design:type", Array)
], TagType.prototype, "tags", void 0);
exports.TagType = TagType = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('tag_type', { mikroOrmRepository: () => mikro_orm_tag_type_repository_1.MikroOrmTagTypeRepository })
], TagType);
//# sourceMappingURL=tag-type.entity.js.map