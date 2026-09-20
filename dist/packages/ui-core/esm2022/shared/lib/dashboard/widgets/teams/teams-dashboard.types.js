/**
 * Bucket key for time logged WITHOUT a task.
 *
 * The legacy page produced the same bucket implicitly (grouping on an
 * `undefined` `taskId` yields the string `"undefined"`); naming it means the
 * template can recognize it instead of testing for a missing title.
 */
export const NO_TASK_ID = '__no_task__';
//# sourceMappingURL=teams-dashboard.types.js.map