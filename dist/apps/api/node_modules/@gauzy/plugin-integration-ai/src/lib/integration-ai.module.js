"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationAIModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const gauzy_ai_module_1 = require("./gauzy-ai.module");
const integration_ai_controller_1 = require("./integration-ai.controller");
const integration_ai_service_1 = require("./integration-ai.service");
const integration_ai_middleware_1 = require("./integration-ai.middleware");
const integration_ai_event_subscriber_1 = require("./integration-ai-event.subscriber");
const integration_ai_analysis_service_1 = require("./integration-ai-analysis.service");
let IntegrationAIModule = class IntegrationAIModule {
    /**
     * Configures middleware for specific routes and methods.
     * @param consumer The middleware consumer to apply middleware to routes.
     */
    configure(consumer) {
        consumer
            .apply(integration_ai_middleware_1.IntegrationAIMiddleware)
            .forRoutes({ path: '/employee-job', method: common_1.RequestMethod.GET }, { path: '/employee-job/apply', method: common_1.RequestMethod.POST }, { path: '/employee-job/updateApplied', method: common_1.RequestMethod.POST }, { path: '/employee-job/hide', method: common_1.RequestMethod.POST }, { path: '/employee-job/pre-process', method: common_1.RequestMethod.POST }, { path: '/employee-job/application/:employeeJobApplicationId', method: common_1.RequestMethod.GET }, { path: '/employee-job/generate-proposal/:employeeJobApplicationId', method: common_1.RequestMethod.POST }, { path: '/employee-job/statistics', method: common_1.RequestMethod.GET }, { path: '/employee-job/:id/job-search-status', method: common_1.RequestMethod.PUT }, { path: '/job-preset', method: common_1.RequestMethod.POST }, { path: '/job-preset', method: common_1.RequestMethod.GET }, { path: '/job-preset/employee/:employeeId/criterion', method: common_1.RequestMethod.POST }, { path: '/timesheet/screenshot', method: common_1.RequestMethod.POST });
    }
};
exports.IntegrationAIModule = IntegrationAIModule;
exports.IntegrationAIModule = IntegrationAIModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [integration_ai_controller_1.IntegrationAIController],
        imports: [
            core_1.RolePermissionModule,
            core_1.IntegrationTenantModule,
            core_1.IntegrationModule,
            gauzy_ai_module_1.GauzyAIModule.forRoot(),
            core_1.PluginCommonModule,
            cqrs_1.CqrsModule
        ],
        providers: [
            integration_ai_service_1.IntegrationAIService,
            integration_ai_analysis_service_1.IntegrationAIAnalysisService,
            integration_ai_middleware_1.IntegrationAIMiddleware,
            integration_ai_event_subscriber_1.IntegrationAIEventSubscriber
        ]
    })
], IntegrationAIModule);
//# sourceMappingURL=integration-ai.module.js.map