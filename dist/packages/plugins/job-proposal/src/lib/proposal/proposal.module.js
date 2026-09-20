"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const core_1 = require("@gauzy/core");
const proposal_entity_1 = require("./proposal.entity");
const proposal_controller_1 = require("./proposal.controller");
const proposal_service_1 = require("./proposal.service");
const handlers_1 = require("./commands/handlers");
const proposal_seeder_service_1 = require("./proposal-seeder.service");
const type_orm_proposal_repository_1 = require("./repository/type-orm-proposal.repository");
const mikro_orm_proposal_repository_1 = require("./repository/mikro-orm-proposal.repository");
let ProposalModule = class ProposalModule {
};
exports.ProposalModule = ProposalModule;
exports.ProposalModule = ProposalModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [
            proposal_controller_1.ProposalController
        ],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([proposal_entity_1.Proposal]),
            nestjs_1.MikroOrmModule.forFeature([proposal_entity_1.Proposal]),
            core_1.RolePermissionModule,
            core_1.SeederModule,
            cqrs_1.CqrsModule
        ],
        providers: [
            proposal_service_1.ProposalService,
            proposal_seeder_service_1.ProposalSeederService,
            type_orm_proposal_repository_1.TypeOrmProposalRepository,
            mikro_orm_proposal_repository_1.MikroOrmProposalRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [
            proposal_seeder_service_1.ProposalSeederService
        ]
    })
], ProposalModule);
//# sourceMappingURL=proposal.module.js.map