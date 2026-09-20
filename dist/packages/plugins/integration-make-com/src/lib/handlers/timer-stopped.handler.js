"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerStoppedHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const webhook_service_1 = require("../webhook.service");
let TimerStoppedHandler = class TimerStoppedHandler {
    constructor(webhookService) {
        this.webhookService = webhookService;
    }
    /**
     * Handles the TimerStoppedEvent by emitting a 'stop' event with the corresponding time log.
     *
     * @param event - The TimerStoppedEvent containing the time log details.
     * @returns A promise that resolves once the timer stop event is successfully emitted.
     */
    async handle(event) {
        await this.webhookService.emitTimerEvent('stop', event.timeLog);
    }
};
exports.TimerStoppedHandler = TimerStoppedHandler;
exports.TimerStoppedHandler = TimerStoppedHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.EventsHandler)(core_1.TimerStoppedEvent),
    tslib_1.__metadata("design:paramtypes", [webhook_service_1.WebhookService])
], TimerStoppedHandler);
//# sourceMappingURL=timer-stopped.handler.js.map