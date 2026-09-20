"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationAward = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_organization_award_repository_1 = require("./repository/mikro-orm-organization-award.repository");
let OrganizationAward = class OrganizationAward extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationAward = OrganizationAward;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationAward.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationAward.prototype, "year", void 0);
exports.OrganizationAward = OrganizationAward = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_award', { mikroOrmRepository: () => mikro_orm_organization_award_repository_1.MikroOrmOrganizationAwardRepository })
], OrganizationAward);
//# sourceMappingURL=organization-award.entity.js.map