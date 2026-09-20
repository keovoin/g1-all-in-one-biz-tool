"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectBudgetTypeEnum = exports.TaskListTypeEnum = exports.ProjectStatusEnum = void 0;
/**
 * Project status enum
 */
var ProjectStatusEnum;
(function (ProjectStatusEnum) {
    ProjectStatusEnum["OPEN"] = "open";
    ProjectStatusEnum["IN_PROGRESS"] = "in-progress";
    ProjectStatusEnum["COMPLETED"] = "completed";
    ProjectStatusEnum["CANCELLED"] = "cancelled";
    ProjectStatusEnum["CUSTOM"] = "custom";
})(ProjectStatusEnum || (exports.ProjectStatusEnum = ProjectStatusEnum = {}));
// Task List Type Enum
var TaskListTypeEnum;
(function (TaskListTypeEnum) {
    TaskListTypeEnum["GRID"] = "GRID";
    TaskListTypeEnum["SPRINT"] = "SPRINT";
})(TaskListTypeEnum || (exports.TaskListTypeEnum = TaskListTypeEnum = {}));
// Organization Project Budget Type Enum
var OrganizationProjectBudgetTypeEnum;
(function (OrganizationProjectBudgetTypeEnum) {
    OrganizationProjectBudgetTypeEnum["HOURS"] = "hours";
    OrganizationProjectBudgetTypeEnum["COST"] = "cost";
})(OrganizationProjectBudgetTypeEnum || (exports.OrganizationProjectBudgetTypeEnum = OrganizationProjectBudgetTypeEnum = {}));
//# sourceMappingURL=organization-projects.model.js.map