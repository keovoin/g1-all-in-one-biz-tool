"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecentVisitController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const decorators_1 = require("../shared/decorators");
const guards_1 = require("../shared/guards");
const pipes_1 = require("../shared/pipes");
const employee_recent_visit_service_1 = require("./employee-recent-visit.service");
const get_employee_recent_visits_dto_1 = require("./dto/get-employee-recent-visits.dto");
let EmployeeRecentVisitController = class EmployeeRecentVisitController {
    constructor(_employeeRecentVisitService) {
        this._employeeRecentVisitService = _employeeRecentVisitService;
    }
    /**
     * Retrieves employee recent visits based on query parameters.
     * Supports filtering, pagination, sorting, and ordering.
     *
     * @param query Query parameters for filtering, pagination, and ordering.
     * @returns A list of employee recent visits.
     */
    async getEmployeeRecentVisits(query) {
        return await this._employeeRecentVisitService.findEmployeeRecentVisits(query);
    }
};
exports.EmployeeRecentVisitController = EmployeeRecentVisitController;
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [get_employee_recent_visits_dto_1.GetEmployeeRecentVisitsDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeRecentVisitController.prototype, "getEmployeeRecentVisits", null);
exports.EmployeeRecentVisitController = EmployeeRecentVisitController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(),
    (0, common_1.Controller)('/employee-recent-visit'),
    tslib_1.__metadata("design:paramtypes", [employee_recent_visit_service_1.EmployeeRecentVisitService])
], EmployeeRecentVisitController);
//# sourceMappingURL=employee-recent-visit.controller.js.map