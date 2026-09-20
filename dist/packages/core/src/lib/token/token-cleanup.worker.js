"use strict";
var TokenCleanupWorker_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCleanupWorker = void 0;
const tslib_1 = require("tslib");
const scheduler_1 = require("@gauzy/scheduler");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const bullmq_1 = require("bullmq");
const commands_1 = require("./commands");
const token_config_registry_1 = require("./token-config.registry");
const token_constant_1 = require("./token-constant");
let TokenCleanupWorker = TokenCleanupWorker_1 = class TokenCleanupWorker extends scheduler_1.QueueWorkerHost {
    constructor(commandBus, configRegistry) {
        super();
        this.commandBus = commandBus;
        this.configRegistry = configRegistry;
        this.logger = new common_1.Logger(TokenCleanupWorker_1.name);
    }
    async handleExpired(job) {
        this.logger.log(`Process expired cleanup requested at ${job.data.requestedAt}`);
        try {
            this.logger.log('Starting expired token cleanup');
            const count = await this.commandBus.execute(new commands_1.CleanupExpiredTokensCommand());
            this.logger.log(`Marked ${count} tokens as expired`);
        }
        catch (error) {
            this.logger.error('Failed to cleanup expired tokens', error);
            throw error;
        }
    }
    async handleInactive(job) {
        this.logger.log(`Process inactive cleanup requested at ${job.data.requestedAt}`);
        try {
            this.logger.log('Starting inactive token cleanup');
            const registeredTypes = this.configRegistry.getRegisteredTypes();
            let totalRevoked = 0;
            for (const tokenType of registeredTypes) {
                const config = this.configRegistry.getConfig(tokenType);
                if (config.threshold != null) {
                    const count = await this.commandBus.execute(new commands_1.CleanupInactiveTokensCommand(tokenType, config.threshold));
                    totalRevoked += count;
                    this.logger.log(`Revoked ${count} inactive ${tokenType} tokens`);
                }
            }
            this.logger.log(`Total inactive tokens revoked: ${totalRevoked}`);
        }
        catch (error) {
            this.logger.error('Failed to cleanup inactive tokens', error);
            throw error;
        }
    }
};
exports.TokenCleanupWorker = TokenCleanupWorker;
tslib_1.__decorate([
    (0, scheduler_1.QueueJobHandler)(token_constant_1.TOKEN_CLEANUP_EXPIRED_JOB),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_1.Job]),
    tslib_1.__metadata("design:returntype", Promise)
], TokenCleanupWorker.prototype, "handleExpired", null);
tslib_1.__decorate([
    (0, scheduler_1.QueueJobHandler)(token_constant_1.TOKEN_CLEANUP_INACTIVE_JOB),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_1.Job]),
    tslib_1.__metadata("design:returntype", Promise)
], TokenCleanupWorker.prototype, "handleInactive", null);
exports.TokenCleanupWorker = TokenCleanupWorker = TokenCleanupWorker_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, scheduler_1.QueueWorker)(token_constant_1.TOKEN_QUEUE_NAME),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        token_config_registry_1.TokenConfigRegistry])
], TokenCleanupWorker);
//# sourceMappingURL=token-cleanup.worker.js.map