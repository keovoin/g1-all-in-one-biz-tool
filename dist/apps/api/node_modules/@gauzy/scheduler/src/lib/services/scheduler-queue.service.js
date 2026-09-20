"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerQueueService = void 0;
const tslib_1 = require("tslib");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const scheduler_constants_1 = require("../constants/scheduler.constants");
let SchedulerQueueService = class SchedulerQueueService {
    constructor(moduleRef, moduleOptions) {
        this.moduleRef = moduleRef;
        this.moduleOptions = moduleOptions;
    }
    async enqueue(input) {
        if (!this.moduleOptions.enableQueueing) {
            throw new Error(`Queueing is disabled. Cannot enqueue job "${input.jobName}" for queue "${input.queueName}".`);
        }
        const queue = this.getQueue(input.queueName);
        await queue.add(input.jobName, input.data, input.options);
    }
    getQueue(queueName) {
        const token = (0, bullmq_1.getQueueToken)(queueName);
        let queue;
        try {
            queue = this.moduleRef.get(token, { strict: false });
        }
        catch {
            queue = undefined;
        }
        if (!queue) {
            throw new Error(`Queue "${queueName}" is not registered. Add it via SchedulerModule.forFeature({ queues: [...] }).`);
        }
        return queue;
    }
};
exports.SchedulerQueueService = SchedulerQueueService;
exports.SchedulerQueueService = SchedulerQueueService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(1, (0, common_1.Inject)(scheduler_constants_1.SCHEDULER_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [core_1.ModuleRef, Object])
], SchedulerQueueService);
//# sourceMappingURL=scheduler-queue.service.js.map