"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicShareModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const public_employee_module_1 = require("./employee/public-employee.module");
const public_invoice_module_1 = require("./invoice/public-invoice.module");
const public_organization_module_1 = require("./organization/public-organization.module");
const public_team_module_1 = require("./team/public-team.module");
let PublicShareModule = class PublicShareModule {
};
exports.PublicShareModule = PublicShareModule;
exports.PublicShareModule = PublicShareModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [public_employee_module_1.PublicEmployeeModule, public_invoice_module_1.PublicInvoiceModule, public_organization_module_1.PublicOrganizationModule, public_team_module_1.PublicTeamModule]
    })
], PublicShareModule);
//# sourceMappingURL=public-share.module.js.map