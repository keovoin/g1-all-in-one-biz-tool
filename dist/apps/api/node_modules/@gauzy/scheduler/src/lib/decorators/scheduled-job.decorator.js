"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledJob = ScheduledJob;
const common_1 = require("@nestjs/common");
const scheduler_constants_1 = require("../constants/scheduler.constants");
function ScheduledJob(options = {}) {
    return (0, common_1.SetMetadata)(scheduler_constants_1.SCHEDULED_JOB_METADATA, options);
}
//# sourceMappingURL=scheduled-job.decorator.js.map