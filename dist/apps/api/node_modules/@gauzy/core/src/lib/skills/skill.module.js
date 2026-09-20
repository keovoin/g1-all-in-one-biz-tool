"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const skill_service_1 = require("./skill.service");
const skill_controller_1 = require("./skill.controller");
const skill_entity_1 = require("./skill.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_skill_repository_1 = require("./repository/type-orm-skill.repository");
const mikro_orm_skill_repository_1 = require("./repository/mikro-orm-skill.repository");
let SkillModule = class SkillModule {
};
exports.SkillModule = SkillModule;
exports.SkillModule = SkillModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([skill_entity_1.Skill]), nestjs_1.MikroOrmModule.forFeature([skill_entity_1.Skill]), role_permission_module_1.RolePermissionModule],
        controllers: [skill_controller_1.SkillController],
        providers: [skill_service_1.SkillService, type_orm_skill_repository_1.TypeOrmSkillRepository, mikro_orm_skill_repository_1.MikroOrmSkillRepository]
    })
], SkillModule);
//# sourceMappingURL=skill.module.js.map