"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapierTimerStoppedHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const zapier_webhook_service_1 = require("../zapier-webhook.service");
let ZapierTimerStoppedHandler = class ZapierTimerStoppedHandler {
    constructor(zapierWebhookService) {
        this.zapierWebhookService = zapierWebhookService;
    }
    /**
     * Handles the TimerStoppedEvent by notifying Zapier webhooks
     *
     * @param event - The TimerStoppedEvent that contains the time log details.
     * @returns A Promise that resolves once the webhooks are notified
     */
    async handle(event) {
        const timeLog = event.timeLog;
        if (!timeLog.tenantId || !timeLog.organizationId) {
            console.warn('Cannot process timer stopped event: missing tenantId or organizationId');
            return;
        }
        await this.zapierWebhookService.notifyTimerStatusChanged({
            event: 'timer.status.changed',
            action: 'stop',
            data: timeLog,
            tenantId: timeLog.tenantId,
            organizationId: timeLog.organizationId
        });
    }
};
exports.ZapierTimerStoppedHandler = ZapierTimerStoppedHandler;
exports.ZapierTimerStoppedHandler = ZapierTimerStoppedHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.EventsHandler)(core_1.TimerStoppedEvent),
    tslib_1.__metadata("design:paramtypes", [zapier_webhook_service_1.ZapierWebhookService])
], ZapierTimerStoppedHandler);
//# sourceMappingURL=zapier-timer-stopped.handler.js.map