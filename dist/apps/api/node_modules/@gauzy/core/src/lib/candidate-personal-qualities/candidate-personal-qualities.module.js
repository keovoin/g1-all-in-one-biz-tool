"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatePersonalQualitiesModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const candidate_personal_qualities_service_1 = require("./candidate-personal-qualities.service");
const candidate_personal_qualities_controller_1 = require("./candidate-personal-qualities.controller");
const candidate_personal_qualities_entity_1 = require("./candidate-personal-qualities.entity");
const handlers_1 = require("./commands/handlers");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_candidate_personal_qualities_repository_1 = require("./repository/type-orm-candidate-personal-qualities.repository");
const mikro_orm_candidate_personal_qualities_repository_1 = require("./repository/mikro-orm-candidate-personal-qualities.repository");
let CandidatePersonalQualitiesModule = class CandidatePersonalQualitiesModule {
};
exports.CandidatePersonalQualitiesModule = CandidatePersonalQualitiesModule;
exports.CandidatePersonalQualitiesModule = CandidatePersonalQualitiesModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([candidate_personal_qualities_entity_1.CandidatePersonalQualities]),
            nestjs_1.MikroOrmModule.forFeature([candidate_personal_qualities_entity_1.CandidatePersonalQualities]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [candidate_personal_qualities_controller_1.CandidatePersonalQualitiesController],
        providers: [candidate_personal_qualities_service_1.CandidatePersonalQualitiesService, type_orm_candidate_personal_qualities_repository_1.TypeOrmCandidatePersonalQualitiesRepository, mikro_orm_candidate_personal_qualities_repository_1.MikroOrmCandidatePersonalQualitiesRepository, ...handlers_1.CommandHandlers],
        exports: [candidate_personal_qualities_service_1.CandidatePersonalQualitiesService]
    })
], CandidatePersonalQualitiesModule);
//# sourceMappingURL=candidate-personal-qualities.module.js.map