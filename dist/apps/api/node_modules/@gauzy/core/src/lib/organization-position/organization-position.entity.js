"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationPosition = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_organization_position_repository_1 = require("./repository/mikro-orm-organization-position.repository");
let OrganizationPosition = class OrganizationPosition extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationPosition = OrganizationPosition;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationPosition.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Tag, isArray: true }),
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (tag) => tag.organizationPositions, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'tag_organization_position',
        joinColumn: 'organizationPositionId',
        inverseJoinColumn: 'tagId',
    }),
    (0, typeorm_1.JoinTable)({
        name: 'tag_organization_position'
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationPosition.prototype, "tags", void 0);
exports.OrganizationPosition = OrganizationPosition = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_position', { mikroOrmRepository: () => mikro_orm_organization_position_repository_1.MikroOrmOrganizationPositionRepository })
], OrganizationPosition);
//# sourceMappingURL=organization-position.entity.js.map