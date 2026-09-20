"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateExperienceModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const candidate_experience_entity_1 = require("./candidate-experience.entity");
const candidate_experience_service_1 = require("./candidate-experience.service");
const candidate_experience_controller_1 = require("./candidate-experience.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_candidate_experience_repository_1 = require("./repository/type-orm-candidate-experience.repository");
const mikro_orm_candidate_experience_repository_1 = require("./repository/mikro-orm-candidate-experience.repository");
let CandidateExperienceModule = class CandidateExperienceModule {
};
exports.CandidateExperienceModule = CandidateExperienceModule;
exports.CandidateExperienceModule = CandidateExperienceModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([candidate_experience_entity_1.CandidateExperience]),
            nestjs_1.MikroOrmModule.forFeature([candidate_experience_entity_1.CandidateExperience]),
            role_permission_module_1.RolePermissionModule
        ],
        providers: [candidate_experience_service_1.CandidateExperienceService, type_orm_candidate_experience_repository_1.TypeOrmCandidateExperienceRepository, mikro_orm_candidate_experience_repository_1.MikroOrmCandidateExperienceRepository],
        controllers: [candidate_experience_controller_1.CandidateExperienceController]
    })
], CandidateExperienceModule);
//# sourceMappingURL=candidate-experience.module.js.map