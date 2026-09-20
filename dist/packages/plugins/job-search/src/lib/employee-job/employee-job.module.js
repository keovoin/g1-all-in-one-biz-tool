"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeJobPostModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const plugin_integration_ai_1 = require("@gauzy/plugin-integration-ai");
const core_1 = require("@gauzy/core");
const employee_job_service_1 = require("./employee-job.service");
const employee_job_controller_1 = require("./employee-job.controller");
const commands_1 = require("./commands");
const queries_1 = require("./queries");
let EmployeeJobPostModule = class EmployeeJobPostModule {
};
exports.EmployeeJobPostModule = EmployeeJobPostModule;
exports.EmployeeJobPostModule = EmployeeJobPostModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            core_1.EmployeeModule,
            core_1.IntegrationTenantModule,
            core_1.TenantModule,
            core_1.RolePermissionModule,
            plugin_integration_ai_1.GauzyAIModule.forRoot(),
            cqrs_1.CqrsModule
        ],
        controllers: [employee_job_controller_1.EmployeeJobPostController],
        providers: [employee_job_service_1.EmployeeJobPostService, ...commands_1.CommandHandlers, ...queries_1.QueryHandlers]
    })
], EmployeeJobPostModule);
//# sourceMappingURL=employee-job.module.js.map