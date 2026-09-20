"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateCriterionsRatingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const candidate_criterion_rating_entity_1 = require("./candidate-criterion-rating.entity");
const candidate_criterion_rating_service_1 = require("./candidate-criterion-rating.service");
const candidate_criterion_rating_controller_1 = require("./candidate-criterion-rating.controller");
const handlers_1 = require("./commands/handlers");
const type_orm_candidate_criterions_rating_repository_1 = require("./repository/type-orm-candidate-criterions-rating.repository");
const mikro_orm_candidate_criterions_rating_repository_1 = require("./repository/mikro-orm-candidate-criterions-rating.repository");
let CandidateCriterionsRatingModule = class CandidateCriterionsRatingModule {
};
exports.CandidateCriterionsRatingModule = CandidateCriterionsRatingModule;
exports.CandidateCriterionsRatingModule = CandidateCriterionsRatingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([candidate_criterion_rating_entity_1.CandidateCriterionsRating]),
            nestjs_1.MikroOrmModule.forFeature([candidate_criterion_rating_entity_1.CandidateCriterionsRating]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        providers: [candidate_criterion_rating_service_1.CandidateCriterionsRatingService, type_orm_candidate_criterions_rating_repository_1.TypeOrmCandidateCriterionsRatingRepository, mikro_orm_candidate_criterions_rating_repository_1.MikroOrmCandidateCriterionsRatingRepository, ...handlers_1.CommandHandlers],
        controllers: [candidate_criterion_rating_controller_1.CandidateCriterionsRatingController]
    })
], CandidateCriterionsRatingModule);
//# sourceMappingURL=candidate-criterion-rating.module.js.map