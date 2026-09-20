"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const create_job_preset_handler_1 = require("./create-job-preset.handler");
const save_employee_criterion_handler_1 = require("./save-employee-criterion.handler");
const save_employee_preset_handler_1 = require("./save-employee-preset.handler");
const save_preset_criterion_handler_1 = require("./save-preset-criterion.handler");
exports.CommandHandlers = [
    create_job_preset_handler_1.CreateJobPresetHandler,
    save_preset_criterion_handler_1.SavePresetCriterionHandler,
    save_employee_preset_handler_1.SaveEmployeePresetHandler,
    save_employee_criterion_handler_1.SaveEmployeeCriterionHandler
];
//# sourceMappingURL=index.js.map