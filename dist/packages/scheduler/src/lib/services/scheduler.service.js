"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const scheduler_job_registry_service_1 = require("./scheduler-job-registry.service");
const scheduler_job_runner_service_1 = require("./scheduler-job-runner.service");
const scheduler_queue_service_1 = require("./scheduler-queue.service");
let SchedulerService = class SchedulerService {
    constructor(jobRegistry, jobRunner, queueService) {
        this.jobRegistry = jobRegistry;
        this.jobRunner = jobRunner;
        this.queueService = queueService;
    }
    listJobs() {
        return this.jobRegistry.getAll().map((job) => ({
            id: job.id,
            providerName: job.providerName,
            methodName: job.methodName,
            description: job.options.description,
            enabled: job.options.enabled,
            runOnStart: job.options.runOnStart,
            scheduleType: this.resolveScheduleType(job.options.cron, job.options.intervalMs),
            executionTarget: job.options.queueName ? 'queue' : 'inline',
            cron: job.options.cron,
            intervalMs: job.options.intervalMs,
            queueName: job.options.queueName,
            queueJobName: job.options.queueJobName,
            running: this.jobRunner.isRunning(job.id)
        }));
    }
    async triggerNow(jobId) {
        const job = this.jobRegistry.getById(jobId);
        if (!job) {
            throw new common_1.NotFoundException(`Scheduled job "${jobId}" not found.`);
        }
        await this.jobRunner.execute(job);
    }
    async enqueue(input) {
        await this.queueService.enqueue(input);
    }
    resolveScheduleType(cron, intervalMs) {
        if (cron) {
            return 'cron';
        }
        if (intervalMs !== undefined) {
            return 'interval';
        }
        return 'manual';
    }
};
exports.SchedulerService = SchedulerService;
exports.SchedulerService = SchedulerService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [scheduler_job_registry_service_1.SchedulerJobRegistryService,
        scheduler_job_runner_service_1.SchedulerJobRunnerService,
        scheduler_queue_service_1.SchedulerQueueService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map