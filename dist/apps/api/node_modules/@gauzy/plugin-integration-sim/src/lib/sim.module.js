"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimModule = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const sim_service_1 = require("./sim.service");
const sim_controller_1 = require("./sim.controller");
const sim_client_factory_1 = require("./sim-client.factory");
const sim_repository_service_1 = require("./sim-repository.service");
const sim_workflow_execution_entity_1 = require("./sim-workflow-execution.entity");
const mikro_orm_sim_workflow_execution_repository_1 = require("./repository/mikro-orm-sim-workflow-execution.repository");
const type_orm_sim_workflow_execution_repository_1 = require("./repository/type-orm-sim-workflow-execution.repository");
const handlers_1 = require("./handlers");
let SimModule = class SimModule {
};
exports.SimModule = SimModule;
exports.SimModule = SimModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            cqrs_1.CqrsModule,
            config_1.ConfigModule,
            core_1.IntegrationEntitySettingModule,
            core_1.IntegrationMapModule,
            core_1.IntegrationModule,
            core_1.IntegrationSettingModule,
            core_1.IntegrationTenantModule,
            core_1.PluginCommonModule,
            core_1.RolePermissionModule,
            typeorm_1.TypeOrmModule.forFeature([sim_workflow_execution_entity_1.SimWorkflowExecution]),
            nestjs_1.MikroOrmModule.forFeature([sim_workflow_execution_entity_1.SimWorkflowExecution])
        ],
        controllers: [sim_controller_1.SimController],
        providers: [
            sim_service_1.SimService,
            sim_client_factory_1.SimClientFactory,
            sim_repository_service_1.SimRepositoryService,
            mikro_orm_sim_workflow_execution_repository_1.MikroOrmSimWorkflowExecutionRepository,
            type_orm_sim_workflow_execution_repository_1.TypeOrmSimWorkflowExecutionRepository,
            ...handlers_1.EventHandlers
        ],
        exports: [sim_service_1.SimService, sim_client_factory_1.SimClientFactory, sim_repository_service_1.SimRepositoryService]
    })
], SimModule);
//# sourceMappingURL=sim.module.js.map