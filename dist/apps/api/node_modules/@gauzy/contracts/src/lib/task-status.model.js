"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatusEnum = void 0;
/**
 * Default task statuses
 */
var TaskStatusEnum;
(function (TaskStatusEnum) {
    TaskStatusEnum["BACKLOG"] = "backlog";
    TaskStatusEnum["OPEN"] = "open";
    TaskStatusEnum["IN_PROGRESS"] = "in-progress";
    TaskStatusEnum["READY_FOR_REVIEW"] = "ready-for-review";
    TaskStatusEnum["IN_REVIEW"] = "in-review";
    TaskStatusEnum["BLOCKED"] = "blocked";
    TaskStatusEnum["DONE"] = "done";
    TaskStatusEnum["COMPLETED"] = "completed";
    TaskStatusEnum["CANCELLED"] = "cancelled";
    TaskStatusEnum["CUSTOM"] = "custom";
})(TaskStatusEnum || (exports.TaskStatusEnum = TaskStatusEnum = {}));
//# sourceMappingURL=task-status.model.js.map