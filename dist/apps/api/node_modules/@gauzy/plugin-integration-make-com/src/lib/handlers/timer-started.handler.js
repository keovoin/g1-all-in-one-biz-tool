"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerStartedHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const webhook_service_1 = require("../webhook.service");
let TimerStartedHandler = class TimerStartedHandler {
    constructor(webhookService) {
        this.webhookService = webhookService;
    }
    /**
     * Handles the TimerStartedEvent by emitting a 'start' timer event
     * through the WebhookService.
     *
     * @param event - The TimerStartedEvent that contains the time log details.
     * @returns A Promise that resolves once the timer event is emitted.
     */
    async handle(event) {
        await this.webhookService.emitTimerEvent('start', event.timeLog);
    }
};
exports.TimerStartedHandler = TimerStartedHandler;
exports.TimerStartedHandler = TimerStartedHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.EventsHandler)(core_1.TimerStartedEvent),
    tslib_1.__metadata("design:paramtypes", [webhook_service_1.WebhookService])
], TimerStartedHandler);
//# sourceMappingURL=timer-started.handler.js.map