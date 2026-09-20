"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateSourceModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const candidate_source_service_1 = require("./candidate-source.service");
const candidate_source_entity_1 = require("./candidate-source.entity");
const candidate_source_controller_1 = require("./candidate-source.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_candidate_source_repository_1 = require("./repository/type-orm-candidate-source.repository");
const mikro_orm_candidate_source_repository_1 = require("./repository/mikro-orm-candidate-source.repository");
let CandidateSourceModule = class CandidateSourceModule {
};
exports.CandidateSourceModule = CandidateSourceModule;
exports.CandidateSourceModule = CandidateSourceModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([candidate_source_entity_1.CandidateSource]),
            nestjs_1.MikroOrmModule.forFeature([candidate_source_entity_1.CandidateSource]),
            role_permission_module_1.RolePermissionModule
        ],
        providers: [candidate_source_service_1.CandidateSourceService, type_orm_candidate_source_repository_1.TypeOrmCandidateSourceRepository, mikro_orm_candidate_source_repository_1.MikroOrmCandidateSourceRepository],
        controllers: [candidate_source_controller_1.CandidateSourceController]
    })
], CandidateSourceModule);
//# sourceMappingURL=candidate-source.module.js.map