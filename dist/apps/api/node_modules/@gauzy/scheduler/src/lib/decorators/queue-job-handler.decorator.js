"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueJobHandler = QueueJobHandler;
const common_1 = require("@nestjs/common");
const scheduler_constants_1 = require("../constants/scheduler.constants");
function QueueJobHandler(jobName) {
    const normalizedJobName = jobName?.trim();
    if (!normalizedJobName) {
        throw new Error('Queue job handler name cannot be empty.');
    }
    return (0, common_1.SetMetadata)(scheduler_constants_1.QUEUE_JOB_HANDLER_METADATA, normalizedJobName);
}
//# sourceMappingURL=queue-job-handler.decorator.js.map