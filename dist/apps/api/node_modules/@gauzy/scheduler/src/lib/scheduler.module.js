"use strict";
var SchedulerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerModule = void 0;
const tslib_1 = require("tslib");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const scheduler_constants_1 = require("./constants/scheduler.constants");
const scheduled_job_metadata_accessor_1 = require("./services/scheduled-job-metadata.accessor");
const scheduler_discovery_service_1 = require("./services/scheduler-discovery.service");
const scheduler_job_registry_service_1 = require("./services/scheduler-job-registry.service");
const scheduler_job_runner_service_1 = require("./services/scheduler-job-runner.service");
const scheduler_queue_service_1 = require("./services/scheduler-queue.service");
const scheduler_service_1 = require("./services/scheduler.service");
const normalize_queue_registrations_1 = require("./utils/normalize-queue-registrations");
const normalize_scheduler_options_1 = require("./utils/normalize-scheduler-options");
let SchedulerModule = SchedulerModule_1 = class SchedulerModule {
    static forRoot(options = {}) {
        const normalizedOptions = (0, normalize_scheduler_options_1.normalizeSchedulerModuleOptions)(options);
        const imports = [core_1.DiscoveryModule, schedule_1.ScheduleModule.forRoot()];
        if (normalizedOptions.enableQueueing) {
            const rootOptions = {
                connection: normalizedOptions.queueConnection
            };
            imports.push(bullmq_1.BullModule.forRoot(rootOptions));
            if (normalizedOptions.queues.length > 0) {
                imports.push(bullmq_1.BullModule.registerQueue(...normalizedOptions.queues));
            }
        }
        return {
            module: SchedulerModule_1,
            global: true,
            imports,
            providers: [
                {
                    provide: scheduler_constants_1.SCHEDULER_MODULE_OPTIONS,
                    useValue: normalizedOptions
                },
                scheduled_job_metadata_accessor_1.ScheduledJobMetadataAccessor,
                scheduler_job_registry_service_1.SchedulerJobRegistryService,
                scheduler_job_runner_service_1.SchedulerJobRunnerService,
                scheduler_queue_service_1.SchedulerQueueService,
                scheduler_discovery_service_1.SchedulerDiscoveryService,
                scheduler_service_1.SchedulerService
            ],
            exports: [scheduler_service_1.SchedulerService, scheduler_queue_service_1.SchedulerQueueService]
        };
    }
    static forFeature(optionsOrProviders = []) {
        const options = Array.isArray(optionsOrProviders)
            ? { jobProviders: optionsOrProviders }
            : optionsOrProviders;
        const queueOptions = (0, normalize_queue_registrations_1.normalizeQueueRegistrations)(options.queues ?? []);
        const imports = queueOptions.length > 0 ? [bullmq_1.BullModule.registerQueue(...queueOptions)] : [];
        const jobProviders = options.jobProviders ?? [];
        return {
            module: SchedulerModule_1,
            imports: [...imports, ...(options.imports ?? [])],
            providers: [...jobProviders],
            exports: [...jobProviders]
        };
    }
};
exports.SchedulerModule = SchedulerModule;
exports.SchedulerModule = SchedulerModule = SchedulerModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], SchedulerModule);
//# sourceMappingURL=scheduler.module.js.map