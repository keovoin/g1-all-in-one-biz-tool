"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_skill_repository_1 = require("./repository/mikro-orm-skill.repository");
let Skill = class Skill extends internal_1.TenantOrganizationBaseEntity {
};
exports.Skill = Skill;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Skill.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Skill.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Skill.prototype, "color", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Employee, (employee) => employee.skills, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'skill_employee',
        joinColumn: 'skillId',
        inverseJoinColumn: 'employeeId',
    }),
    (0, typeorm_1.JoinTable)({
        name: 'skill_employee'
    }),
    tslib_1.__metadata("design:type", Array)
], Skill.prototype, "employees", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Organization, (organization) => organization.skills, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'skill_organization',
        joinColumn: 'skillId',
        inverseJoinColumn: 'organizationId',
    }),
    (0, typeorm_1.JoinTable)({
        name: 'skill_organization'
    }),
    tslib_1.__metadata("design:type", Array)
], Skill.prototype, "organizations", void 0);
exports.Skill = Skill = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('skill', { mikroOrmRepository: () => mikro_orm_skill_repository_1.MikroOrmSkillRepository })
], Skill);
//# sourceMappingURL=skill.entity.js.map