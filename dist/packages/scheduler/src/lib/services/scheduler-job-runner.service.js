"use strict";
var SchedulerJobRunnerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerJobRunnerService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const scheduler_constants_1 = require("../constants/scheduler.constants");
const scheduler_queue_service_1 = require("./scheduler-queue.service");
let SchedulerJobRunnerService = SchedulerJobRunnerService_1 = class SchedulerJobRunnerService {
    constructor(moduleOptions, queueService) {
        this.moduleOptions = moduleOptions;
        this.queueService = queueService;
        this.logger = new common_1.Logger(SchedulerJobRunnerService_1.name);
        this.runningJobs = new Set();
    }
    isRunning(jobId) {
        return this.runningJobs.has(jobId);
    }
    async execute(job) {
        if (!this.moduleOptions.enabled || !job.options.enabled) {
            return;
        }
        if (job.options.preventOverlap && this.runningJobs.has(job.id)) {
            this.logger.warn(`Skipping "${job.id}" because the previous run is still in progress.`);
            return;
        }
        const startedAt = Date.now();
        this.runningJobs.add(job.id);
        try {
            await this.executeWithRetry(job);
            this.logger.debug(`Finished "${job.id}" in ${Date.now() - startedAt}ms`);
        }
        catch (error) {
            const message = error instanceof Error ? error.stack ?? error.message : String(error);
            this.logger.error(`Scheduled job "${job.id}" failed.`, message);
            throw error;
        }
        finally {
            this.runningJobs.delete(job.id);
        }
    }
    async executeWithRetry(job) {
        const attempts = job.options.retries + 1;
        let attempt = 1;
        let lastError;
        while (attempt <= attempts) {
            try {
                await this.executeSingleAttempt(job);
                return;
            }
            catch (error) {
                lastError = error;
                const hasNextAttempt = attempt < attempts;
                if (!hasNextAttempt) {
                    break;
                }
                this.logger.warn(`"${job.id}" failed on attempt ${attempt}/${attempts}. Retrying in ${job.options.retryDelayMs}ms.`);
                await sleep(job.options.retryDelayMs);
                attempt += 1;
            }
        }
        throw lastError;
    }
    async executeSingleAttempt(job) {
        const execution = this.executeJobHandler(job);
        if (job.options.timeoutMs === undefined) {
            await execution;
            return;
        }
        const ac = new AbortController();
        try {
            await Promise.race([execution, timeout(job.options.timeoutMs, job.id, ac.signal)]);
        }
        finally {
            ac.abort(); // Cancel the timeout timer if the job finished first
        }
    }
    async executeJobHandler(job) {
        const data = await Promise.resolve(job.handler());
        if (!job.options.queueName) {
            return;
        }
        await this.queueService.enqueue({
            queueName: job.options.queueName,
            jobName: job.options.queueJobName ?? job.id,
            data,
            options: job.options.queueJobOptions
        });
    }
};
exports.SchedulerJobRunnerService = SchedulerJobRunnerService;
exports.SchedulerJobRunnerService = SchedulerJobRunnerService = SchedulerJobRunnerService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(scheduler_constants_1.SCHEDULER_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [Object, scheduler_queue_service_1.SchedulerQueueService])
], SchedulerJobRunnerService);
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function timeout(ms, jobId, signal) {
    return new Promise((_, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Scheduled job "${jobId}" timed out after ${ms}ms.`));
        }, ms);
        // If the signal is already aborted, clear immediately
        if (signal?.aborted) {
            clearTimeout(timer);
            return;
        }
        // Listen for abort to clear the timer
        signal?.addEventListener('abort', () => {
            clearTimeout(timer);
        }, { once: true });
    });
}
//# sourceMappingURL=scheduler-job-runner.service.js.map