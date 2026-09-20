"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateEducationModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const candidate_education_service_1 = require("./candidate-education.service");
const candidate_education_entity_1 = require("./candidate-education.entity");
const candidate_education_controller_1 = require("./candidate-education.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_candidate_education_repository_1 = require("./repository/type-orm-candidate-education.repository");
const mikro_orm_candidate_education_repository_1 = require("./repository/mikro-orm-candidate-education.repository");
let CandidateEducationModule = class CandidateEducationModule {
};
exports.CandidateEducationModule = CandidateEducationModule;
exports.CandidateEducationModule = CandidateEducationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([candidate_education_entity_1.CandidateEducation]),
            nestjs_1.MikroOrmModule.forFeature([candidate_education_entity_1.CandidateEducation]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [candidate_education_controller_1.CandidateEducationController],
        providers: [candidate_education_service_1.CandidateEducationService, type_orm_candidate_education_repository_1.TypeOrmCandidateEducationRepository, mikro_orm_candidate_education_repository_1.MikroOrmCandidateEducationRepository]
    })
], CandidateEducationModule);
//# sourceMappingURL=candidate-education.module.js.map