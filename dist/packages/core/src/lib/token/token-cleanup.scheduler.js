"use strict";
var TokenCleanupScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCleanupScheduler = void 0;
const tslib_1 = require("tslib");
const scheduler_1 = require("@gauzy/scheduler");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const token_constant_1 = require("./token-constant");
let TokenCleanupScheduler = TokenCleanupScheduler_1 = class TokenCleanupScheduler {
    constructor() {
        this.logger = new common_1.Logger(TokenCleanupScheduler_1.name);
    }
    async enqueueExpiredCleanup() {
        const requestedAt = new Date().toISOString();
        this.logger.log(`Queue expired cleanup at ${requestedAt}`);
        return { requestedAt };
    }
    async enqueueInactiveCleanup() {
        const requestedAt = new Date().toISOString();
        this.logger.log(`Queue inactive cleanup at ${requestedAt}`);
        return { requestedAt };
    }
};
exports.TokenCleanupScheduler = TokenCleanupScheduler;
tslib_1.__decorate([
    (0, scheduler_1.ScheduledJob)({
        name: token_constant_1.TOKEN_CLEANUP_EXPIRED_SCHEDULE,
        cron: schedule_1.CronExpression.EVERY_HOUR,
        queueName: token_constant_1.TOKEN_QUEUE_NAME,
        queueJobName: token_constant_1.TOKEN_CLEANUP_EXPIRED_JOB,
        runOnStart: true,
        preventOverlap: true
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TokenCleanupScheduler.prototype, "enqueueExpiredCleanup", null);
tslib_1.__decorate([
    (0, scheduler_1.ScheduledJob)({
        name: token_constant_1.TOKEN_CLEANUP_INACTIVE_SCHEDULER,
        cron: schedule_1.CronExpression.EVERY_6_HOURS,
        queueName: token_constant_1.TOKEN_QUEUE_NAME,
        queueJobName: token_constant_1.TOKEN_CLEANUP_INACTIVE_JOB,
        runOnStart: true,
        preventOverlap: true
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TokenCleanupScheduler.prototype, "enqueueInactiveCleanup", null);
exports.TokenCleanupScheduler = TokenCleanupScheduler = TokenCleanupScheduler_1 = tslib_1.__decorate([
    (0, common_1.Injectable)()
], TokenCleanupScheduler);
//# sourceMappingURL=token-cleanup.scheduler.js.map