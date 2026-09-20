"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASK_STATUSES_TEMPLATES = void 0;
const contracts_1 = require("@gauzy/contracts");
/**
 * Default task statuses
 */
exports.TASK_STATUSES_TEMPLATES = {
    [contracts_1.TaskStatusEnum.BACKLOG]: { isTodo: true, isInProgress: false, isDone: false },
    [contracts_1.TaskStatusEnum.OPEN]: { isTodo: true, isInProgress: false, isDone: false },
    [contracts_1.TaskStatusEnum.IN_PROGRESS]: { isTodo: false, isInProgress: true, isDone: false },
    [contracts_1.TaskStatusEnum.READY_FOR_REVIEW]: { isTodo: false, isInProgress: true, isDone: false },
    [contracts_1.TaskStatusEnum.IN_REVIEW]: { isTodo: false, isInProgress: true, isDone: false },
    [contracts_1.TaskStatusEnum.BLOCKED]: { isTodo: false, isInProgress: true, isDone: false },
    [contracts_1.TaskStatusEnum.DONE]: { isTodo: false, isInProgress: false, isDone: true },
    [contracts_1.TaskStatusEnum.COMPLETED]: { isTodo: false, isInProgress: false, isDone: true },
    [contracts_1.TaskStatusEnum.CANCELLED]: { isTodo: false, isInProgress: false, isDone: false },
    [contracts_1.TaskStatusEnum.CUSTOM]: { isTodo: false, isInProgress: false, isDone: false }
};
//# sourceMappingURL=standard-statuses-template.js.map