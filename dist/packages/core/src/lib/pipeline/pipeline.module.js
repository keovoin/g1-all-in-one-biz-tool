"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const pipeline_controller_1 = require("./pipeline.controller");
const pipeline_service_1 = require("./pipeline.service");
const typeorm_1 = require("@nestjs/typeorm");
const pipeline_entity_1 = require("./pipeline.entity");
const pipeline_stage_module_1 = require("../pipeline-stage/pipeline-stage.module");
const deal_module_1 = require("../deal/deal.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const user_module_1 = require("./../user/user.module");
const type_orm_pipeline_repository_1 = require("./repository/type-orm-pipeline.repository");
const mikro_orm_pipeline_repository_1 = require("./repository/mikro-orm-pipeline.repository");
let PipelineModule = class PipelineModule {
};
exports.PipelineModule = PipelineModule;
exports.PipelineModule = PipelineModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([pipeline_entity_1.Pipeline]),
            nestjs_1.MikroOrmModule.forFeature([pipeline_entity_1.Pipeline]),
            pipeline_stage_module_1.StageModule,
            deal_module_1.DealModule,
            role_permission_module_1.RolePermissionModule,
            user_module_1.UserModule
        ],
        controllers: [pipeline_controller_1.PipelineController],
        providers: [pipeline_service_1.PipelineService, type_orm_pipeline_repository_1.TypeOrmPipelineRepository, mikro_orm_pipeline_repository_1.MikroOrmPipelineRepository]
    })
], PipelineModule);
//# sourceMappingURL=pipeline.module.js.map