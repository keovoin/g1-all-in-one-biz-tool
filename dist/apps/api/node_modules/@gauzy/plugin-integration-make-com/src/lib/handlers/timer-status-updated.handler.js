"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerStatusUpdatedHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const webhook_service_1 = require("../webhook.service");
let TimerStatusUpdatedHandler = class TimerStatusUpdatedHandler {
    constructor(webhookService) {
        this.webhookService = webhookService;
    }
    /**
     * Handles the TimerStatusUpdatedEvent by emitting a 'status' event with the updated timer status.
     *
     * @param event - The TimerStatusUpdatedEvent containing the updated timer status.
     * @returns A promise that resolves once the timer status event is emitted.
     */
    async handle(event) {
        await this.webhookService.emitTimerEvent('status', event.status);
    }
};
exports.TimerStatusUpdatedHandler = TimerStatusUpdatedHandler;
exports.TimerStatusUpdatedHandler = TimerStatusUpdatedHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.EventsHandler)(core_1.TimerStatusUpdatedEvent),
    tslib_1.__metadata("design:paramtypes", [webhook_service_1.WebhookService])
], TimerStatusUpdatedHandler);
//# sourceMappingURL=timer-status-updated.handler.js.map