"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PROOF_COMPLETION_TYPE = exports.DEFAULT_AUTO_ARCHIVE_ISSUE_PERIOD = exports.DEFAULT_AUTO_CLOSE_ISSUE_PERIOD = exports.DEFAULT_TASK_NOTIFY_PERIOD = exports.TaskProofOfCompletionTypeEnum = void 0;
/**
 * Enumeration for task proof of completion types.
 * Defines whether the proof of task completion is publicly visible or private.
 */
var TaskProofOfCompletionTypeEnum;
(function (TaskProofOfCompletionTypeEnum) {
    TaskProofOfCompletionTypeEnum["PUBLIC"] = "PUBLIC";
    TaskProofOfCompletionTypeEnum["PRIVATE"] = "PRIVATE";
})(TaskProofOfCompletionTypeEnum || (exports.TaskProofOfCompletionTypeEnum = TaskProofOfCompletionTypeEnum = {}));
/**
 * Default period (in days) before sending a notification about a pending task.
 */
exports.DEFAULT_TASK_NOTIFY_PERIOD = 7;
/**
 * Default period (in days) before an unresolved issue is automatically closed.
 */
exports.DEFAULT_AUTO_CLOSE_ISSUE_PERIOD = 7;
/**
 * Default period (in days) before an inactive issue is automatically archived.
 */
exports.DEFAULT_AUTO_ARCHIVE_ISSUE_PERIOD = 7;
/**
 * Default proof of completion type for a task, set to PRIVATE.
 */
exports.DEFAULT_PROOF_COMPLETION_TYPE = TaskProofOfCompletionTypeEnum.PRIVATE;
//# sourceMappingURL=task.js.map