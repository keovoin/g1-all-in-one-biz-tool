"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateTechnologiesModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const candidate_technologies_controller_1 = require("./candidate-technologies.controller");
const candidate_technologies_service_1 = require("./candidate-technologies.service");
const handlers_1 = require("./commands/handlers");
const internal_1 = require("./../core/entities/internal");
const type_orm_candidate_technologies_repository_1 = require("./repository/type-orm-candidate-technologies.repository");
const mikro_orm_candidate_technologies_repository_1 = require("./repository/mikro-orm-candidate-technologies.repository");
let CandidateTechnologiesModule = class CandidateTechnologiesModule {
};
exports.CandidateTechnologiesModule = CandidateTechnologiesModule;
exports.CandidateTechnologiesModule = CandidateTechnologiesModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([internal_1.CandidateTechnologies]),
            nestjs_1.MikroOrmModule.forFeature([internal_1.CandidateTechnologies]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [candidate_technologies_controller_1.CandidateTechnologiesController],
        providers: [candidate_technologies_service_1.CandidateTechnologiesService, type_orm_candidate_technologies_repository_1.TypeOrmCandidateTechnologiesRepository, mikro_orm_candidate_technologies_repository_1.MikroOrmCandidateTechnologiesRepository, ...handlers_1.CommandHandlers],
        exports: [candidate_technologies_service_1.CandidateTechnologiesService]
    })
], CandidateTechnologiesModule);
//# sourceMappingURL=candidate-technologies.module.js.map