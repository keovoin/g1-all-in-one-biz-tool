"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateSkillModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const candidate_skill_entity_1 = require("./candidate-skill.entity");
const candidate_skill_service_1 = require("./candidate-skill.service");
const candidate_skill_controller_1 = require("./candidate-skill.controller");
const type_orm_candidate_skill_repository_1 = require("./repository/type-orm-candidate-skill.repository");
const mikro_orm_candidate_skill_repository_1 = require("./repository/mikro-orm-candidate-skill.repository");
let CandidateSkillModule = class CandidateSkillModule {
};
exports.CandidateSkillModule = CandidateSkillModule;
exports.CandidateSkillModule = CandidateSkillModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([candidate_skill_entity_1.CandidateSkill]),
            nestjs_1.MikroOrmModule.forFeature([candidate_skill_entity_1.CandidateSkill]),
            role_permission_module_1.RolePermissionModule
        ],
        providers: [candidate_skill_service_1.CandidateSkillService, type_orm_candidate_skill_repository_1.TypeOrmCandidateSkillRepository, mikro_orm_candidate_skill_repository_1.MikroOrmCandidateSkillRepository],
        controllers: [candidate_skill_controller_1.CandidateSkillController]
    })
], CandidateSkillModule);
//# sourceMappingURL=candidate-skill.module.js.map