"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpworkModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const plugin_job_proposal_1 = require("@gauzy/plugin-job-proposal");
const upwork_transaction_service_1 = require("./upwork-transaction.service");
const upwork_service_1 = require("./upwork.service");
const upwork_job_service_1 = require("./upwork-job.service");
const upwork_offers_service_1 = require("./upwork-offers.service");
const upwork_report_service_1 = require("./upwork-report.service");
const upwork_authorization_controller_1 = require("./upwork-authorization.controller");
const upwork_controller_1 = require("./upwork.controller");
let UpworkModule = class UpworkModule {
};
exports.UpworkModule = UpworkModule;
exports.UpworkModule = UpworkModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            core_1.EmployeeModule,
            core_1.ExpenseCategoriesModule,
            core_1.ExpenseModule,
            core_1.IncomeModule,
            core_1.IntegrationMapModule,
            core_1.OrganizationContactModule,
            core_1.OrganizationModule,
            core_1.OrganizationVendorModule,
            core_1.RoleModule,
            core_1.RolePermissionModule,
            core_1.TimeSlotModule,
            core_1.UserModule,
            plugin_job_proposal_1.ProposalModule,
            config_1.ConfigModule,
            cqrs_1.CqrsModule
        ],
        controllers: [upwork_authorization_controller_1.UpworkAuthorizationController, upwork_controller_1.UpworkController],
        providers: [upwork_job_service_1.UpworkJobService, upwork_offers_service_1.UpworkOffersService, upwork_report_service_1.UpworkReportService, upwork_transaction_service_1.UpworkTransactionService, upwork_service_1.UpworkService]
    })
], UpworkModule);
//# sourceMappingURL=upwork.module.js.map