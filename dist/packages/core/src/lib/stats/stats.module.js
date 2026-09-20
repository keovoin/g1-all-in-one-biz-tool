"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const feature_module_1 = require("../feature/feature.module");
const employee_module_1 = require("../employee/employee.module");
const organization_module_1 = require("../organization/organization.module");
const organization_team_module_1 = require("../organization-team/organization-team.module");
const tenant_module_1 = require("../tenant/tenant.module");
const user_module_1 = require("../user/user.module");
const invoice_module_1 = require("../invoice/invoice.module");
const payment_module_1 = require("../payment/payment.module");
const task_module_1 = require("../tasks/task.module");
const statistic_1 = require("../time-tracking/statistic");
const stats_controller_1 = require("./stats.controller");
const stats_service_1 = require("./stats.service");
let StatsModule = class StatsModule {
};
exports.StatsModule = StatsModule;
exports.StatsModule = StatsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            feature_module_1.FeatureModule,
            employee_module_1.EmployeeModule,
            organization_module_1.OrganizationModule,
            organization_team_module_1.OrganizationTeamModule,
            tenant_module_1.TenantModule,
            user_module_1.UserModule,
            invoice_module_1.InvoiceModule,
            payment_module_1.PaymentModule,
            task_module_1.TaskModule,
            statistic_1.StatisticModule
        ],
        controllers: [stats_controller_1.StatsController],
        providers: [stats_service_1.StatsService]
    })
], StatsModule);
//# sourceMappingURL=stats.module.js.map