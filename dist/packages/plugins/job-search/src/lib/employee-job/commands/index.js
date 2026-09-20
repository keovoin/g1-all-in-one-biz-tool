"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const tslib_1 = require("tslib");
const update_employee_job_search_status_handler_1 = require("./handlers/update-employee-job-search-status.handler");
tslib_1.__exportStar(require("./update-employee-job-search-status.command"), exports);
exports.CommandHandlers = [update_employee_job_search_status_handler_1.UpdateEmployeeJobSearchStatusHandler];
//# sourceMappingURL=index.js.map