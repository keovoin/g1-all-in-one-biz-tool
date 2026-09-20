"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledJobMetadataAccessor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const scheduler_constants_1 = require("../constants/scheduler.constants");
let ScheduledJobMetadataAccessor = class ScheduledJobMetadataAccessor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    get(target) {
        return this.reflector.get(scheduler_constants_1.SCHEDULED_JOB_METADATA, target);
    }
};
exports.ScheduledJobMetadataAccessor = ScheduledJobMetadataAccessor;
exports.ScheduledJobMetadataAccessor = ScheduledJobMetadataAccessor = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector])
], ScheduledJobMetadataAccessor);
//# sourceMappingURL=scheduled-job-metadata.accessor.js.map