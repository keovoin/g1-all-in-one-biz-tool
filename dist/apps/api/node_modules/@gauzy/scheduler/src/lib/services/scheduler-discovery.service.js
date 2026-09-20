"use strict";
var SchedulerDiscoveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerDiscoveryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const crypto = require("node:crypto");
const scheduler_constants_1 = require("../constants/scheduler.constants");
const scheduled_job_metadata_accessor_1 = require("./scheduled-job-metadata.accessor");
const scheduler_job_registry_service_1 = require("./scheduler-job-registry.service");
const scheduler_job_runner_service_1 = require("./scheduler-job-runner.service");
let SchedulerDiscoveryService = SchedulerDiscoveryService_1 = class SchedulerDiscoveryService {
    constructor(discoveryService, metadataScanner, metadataAccessor, jobRegistry, jobRunner, schedulerRegistry, moduleOptions) {
        this.discoveryService = discoveryService;
        this.metadataScanner = metadataScanner;
        this.metadataAccessor = metadataAccessor;
        this.jobRegistry = jobRegistry;
        this.jobRunner = jobRunner;
        this.schedulerRegistry = schedulerRegistry;
        this.moduleOptions = moduleOptions;
        this.logger = new common_1.Logger(SchedulerDiscoveryService_1.name);
        this.registeredScheduleKinds = new Map();
    }
    onModuleInit() {
        this.discoverJobs();
        this.registerSchedules();
    }
    async onApplicationBootstrap() {
        const startupJobs = this.jobRegistry.getAll().filter((job) => job.options.enabled && job.options.runOnStart);
        for (const job of startupJobs) {
            await this.executeJob(job);
        }
    }
    onApplicationShutdown() {
        this.unregisterSchedules();
    }
    discoverJobs() {
        const wrappers = [
            ...this.discoveryService.getProviders(),
            ...this.discoveryService.getControllers()
        ];
        for (const wrapper of wrappers) {
            if (typeof wrapper.isDependencyTreeStatic === 'function' && !wrapper.isDependencyTreeStatic()) {
                continue;
            }
            const instance = wrapper.instance;
            if (!instance) {
                continue;
            }
            const prototype = Object.getPrototypeOf(instance);
            if (!prototype) {
                continue;
            }
            const providerName = this.resolveProviderName(wrapper, instance);
            const methodNames = this.metadataScanner.getAllMethodNames(prototype);
            for (const methodName of methodNames) {
                const methodCandidate = instance[methodName];
                if (typeof methodCandidate !== 'function') {
                    continue;
                }
                const metadata = this.metadataAccessor.get(methodCandidate);
                if (!metadata) {
                    continue;
                }
                const job = this.jobRegistry.register({
                    providerName,
                    methodName,
                    metadata,
                    handler: async () => {
                        return await Promise.resolve(methodCandidate.call(instance));
                    }
                });
                if (this.moduleOptions.logRegisteredJobs) {
                    this.logger.log(`Registered scheduled job "${job.id}" (${providerName}.${methodName}).`);
                }
            }
        }
    }
    registerSchedules() {
        const jobs = this.jobRegistry.getAll();
        for (const job of jobs) {
            if (!job.options.enabled || !this.moduleOptions.enabled) {
                continue;
            }
            /**
             * Well-formed but not schedulable here — today only "fans out to a queue, but this
             * process has no queueing". Warn rather than schedule it: the handler would run and
             * then die at enqueue on every tick. WARN, not debug, because the job silently not
             * running is a real behaviour change for whoever configured it.
             */
            if (job.options.unschedulableReason) {
                this.logger.warn(`Scheduled job "${job.id}" NOT scheduled — it ${job.options.unschedulableReason}. ` +
                    `Enable queueing in this process (REDIS_ENABLED=true) to run it here, or run it in a process that has it.`);
                continue;
            }
            if (job.options.cron) {
                this.registerCronJob(job);
                continue;
            }
            if (job.options.intervalMs !== undefined) {
                this.registerIntervalJob(job);
                continue;
            }
            if (this.moduleOptions.logRegisteredJobs) {
                this.logger.log(`Job "${job.id}" is registered for manual/startup execution.`);
            }
        }
    }
    registerCronJob(job) {
        const cronJob = new cron_1.CronJob(job.options.cron, () => {
            void this.executeJobWithJitter(job);
        }, null, false, this.moduleOptions.defaultTimezone);
        this.schedulerRegistry.addCronJob(job.id, cronJob);
        this.registeredScheduleKinds.set(job.id, 'cron');
        cronJob.start();
    }
    registerIntervalJob(job) {
        const interval = setInterval(() => {
            void this.executeJobWithJitter(job);
        }, job.options.intervalMs);
        this.schedulerRegistry.addInterval(job.id, interval);
        this.registeredScheduleKinds.set(job.id, 'interval');
    }
    async executeJobWithJitter(job) {
        if (job.options.maxRandomDelayMs > 0) {
            const delayMs = randomDelay(job.options.maxRandomDelayMs);
            await delay(delayMs);
        }
        await this.executeJob(job);
    }
    async executeJob(job) {
        try {
            await this.jobRunner.execute(job);
        }
        catch (error) {
            const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
            this.logger.error(`Job "${job.id}" execution failed.`, message);
        }
    }
    unregisterSchedules() {
        for (const [jobId, scheduleKind] of this.registeredScheduleKinds.entries()) {
            try {
                if (scheduleKind === 'cron') {
                    this.schedulerRegistry.deleteCronJob(jobId);
                    continue;
                }
                this.schedulerRegistry.deleteInterval(jobId);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                this.logger.warn(`Failed to remove "${jobId}" from scheduler registry: ${message}`);
            }
        }
        this.registeredScheduleKinds.clear();
    }
    resolveProviderName(wrapper, instance) {
        if (typeof wrapper.name === 'string' && wrapper.name.trim().length > 0) {
            return wrapper.name;
        }
        const constructorName = instance.constructor.name;
        if (constructorName && constructorName.trim().length > 0) {
            return constructorName;
        }
        return 'AnonymousProvider';
    }
};
exports.SchedulerDiscoveryService = SchedulerDiscoveryService;
exports.SchedulerDiscoveryService = SchedulerDiscoveryService = SchedulerDiscoveryService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(6, (0, common_1.Inject)(scheduler_constants_1.SCHEDULER_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.MetadataScanner,
        scheduled_job_metadata_accessor_1.ScheduledJobMetadataAccessor,
        scheduler_job_registry_service_1.SchedulerJobRegistryService,
        scheduler_job_runner_service_1.SchedulerJobRunnerService,
        schedule_1.SchedulerRegistry, Object])
], SchedulerDiscoveryService);
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function randomDelay(maxMs) {
    if (maxMs <= 0) {
        return 0;
    }
    return Math.floor(crypto.randomInt(0, maxMs + 1));
}
//# sourceMappingURL=scheduler-discovery.service.js.map