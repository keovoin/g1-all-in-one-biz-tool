"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSchedulerModuleOptions = normalizeSchedulerModuleOptions;
const normalize_queue_registrations_1 = require("./normalize-queue-registrations");
const resolve_bull_connection_1 = require("./resolve-bull-connection");
const DEFAULT_JOB_OPTIONS = {
    enabled: true,
    preventOverlap: true,
    retries: 0,
    retryDelayMs: 0,
    timeoutMs: undefined,
    maxRandomDelayMs: 0
};
const DEFAULT_MODULE_OPTIONS = {
    enabled: true,
    logRegisteredJobs: true,
    defaultTimezone: undefined,
    enableQueueing: process.env['REDIS_ENABLED'] === 'true',
    queueConnection: (0, resolve_bull_connection_1.resolveBullConnection)(),
    queues: [],
    defaultQueueName: 'default'
};
function normalizeSchedulerModuleOptions(options = {}) {
    const enableQueueing = options.enableQueueing ?? DEFAULT_MODULE_OPTIONS.enableQueueing;
    const defaultQueueName = (0, normalize_queue_registrations_1.normalizeQueueName)(options.defaultQueueName ?? DEFAULT_MODULE_OPTIONS.defaultQueueName);
    const queues = enableQueueing ? (0, normalize_queue_registrations_1.normalizeQueueRegistrations)(options.queues ?? []) : [];
    return {
        enabled: options.enabled ?? DEFAULT_MODULE_OPTIONS.enabled,
        logRegisteredJobs: options.logRegisteredJobs ?? DEFAULT_MODULE_OPTIONS.logRegisteredJobs,
        defaultTimezone: options.defaultTimezone ?? DEFAULT_MODULE_OPTIONS.defaultTimezone,
        enableQueueing,
        queueConnection: (0, resolve_bull_connection_1.resolveBullConnection)(options.queueConnection),
        queues,
        defaultQueueName,
        defaultJobOptions: {
            enabled: options.defaultJobOptions?.enabled ?? DEFAULT_JOB_OPTIONS.enabled,
            preventOverlap: options.defaultJobOptions?.preventOverlap ?? DEFAULT_JOB_OPTIONS.preventOverlap,
            retries: clampNonNegativeInteger(options.defaultJobOptions?.retries ?? DEFAULT_JOB_OPTIONS.retries),
            retryDelayMs: clampNonNegativeInteger(options.defaultJobOptions?.retryDelayMs ?? DEFAULT_JOB_OPTIONS.retryDelayMs),
            timeoutMs: options.defaultJobOptions?.timeoutMs !== undefined
                ? clampPositiveInteger(options.defaultJobOptions.timeoutMs)
                : DEFAULT_JOB_OPTIONS.timeoutMs,
            maxRandomDelayMs: clampNonNegativeInteger(options.defaultJobOptions?.maxRandomDelayMs ?? DEFAULT_JOB_OPTIONS.maxRandomDelayMs)
        }
    };
}
function clampNonNegativeInteger(value) {
    if (!Number.isFinite(value) || value < 0) {
        throw new Error(`Invalid non-negative integer value "${value}".`);
    }
    return Math.floor(value);
}
function clampPositiveInteger(value) {
    if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`Invalid positive integer value "${value}".`);
    }
    return Math.floor(value);
}
//# sourceMappingURL=normalize-scheduler-options.js.map