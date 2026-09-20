"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("@gauzy/common");
const health_service_1 = require("./health.service");
let HealthController = class HealthController {
    constructor(healthService) {
        this.healthService = healthService;
    }
    async getHealthStatus() {
        return this.healthService.getHealthStatus();
    }
    /**
     * Liveness probe endpoint: reports only that the Node.js process and event
     * loop are responsive. It MUST stay free of any dependency checks (database,
     * storage, cache, redis) — a slow or down dependency should fail readiness
     * (`GET /api/health`), never liveness, otherwise the kubelet kills healthy
     * pods that are merely waiting on a dependency. The session middleware is
     * bypassed for health routes (see bootstrap/redis-store.ts), so this response
     * never waits on a session-store write either.
     *
     * @returns {{ status: string; uptime: number; timestamp: string }} - Process liveness info.
     */
    getLiveness() {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    }
};
exports.HealthController = HealthController;
tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HealthController.prototype, "getHealthStatus", null);
tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.Get)('/live'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], HealthController.prototype, "getLiveness", null);
exports.HealthController = HealthController = tslib_1.__decorate([
    (0, common_1.Controller)('/health'),
    tslib_1.__metadata("design:paramtypes", [health_service_1.HealthService])
], HealthController);
//# sourceMappingURL=health.controller.js.map