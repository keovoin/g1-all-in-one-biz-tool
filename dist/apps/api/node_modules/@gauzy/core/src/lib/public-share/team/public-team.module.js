"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicTeamModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const statistic_1 = require("./../../time-tracking/statistic");
const internal_1 = require("./../../core/entities/internal");
const public_team_controller_1 = require("./public-team.controller");
const public_team_service_1 = require("./public-team.service");
const handlers_1 = require("./queries/handlers");
const timer_module_1 = require("../../time-tracking/timer/timer.module");
const type_orm_organization_team_repository_1 = require("../../organization-team/repository/type-orm-organization-team.repository");
const mikro_orm_organization_team_repository_1 = require("../../organization-team/repository/mikro-orm-organization-team.repository");
let PublicTeamModule = class PublicTeamModule {
};
exports.PublicTeamModule = PublicTeamModule;
exports.PublicTeamModule = PublicTeamModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([internal_1.OrganizationTeam]),
            nestjs_1.MikroOrmModule.forFeature([internal_1.OrganizationTeam]),
            cqrs_1.CqrsModule,
            statistic_1.StatisticModule,
            timer_module_1.TimerModule
        ],
        controllers: [public_team_controller_1.PublicTeamController],
        providers: [public_team_service_1.PublicTeamService, type_orm_organization_team_repository_1.TypeOrmOrganizationTeamRepository, mikro_orm_organization_team_repository_1.MikroOrmOrganizationTeamRepository, ...handlers_1.QueryHandlers]
    })
], PublicTeamModule);
//# sourceMappingURL=public-team.module.js.map