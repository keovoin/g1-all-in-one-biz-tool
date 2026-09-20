"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTimerStatusHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const events_1 = require("../../events");
const timer_service_1 = require("../../timer.service");
const get_timer_status_query_1 = require("../get-timer-status.query");
let GetTimerStatusHandler = class GetTimerStatusHandler {
    constructor(timerService, eventBus) {
        this.timerService = timerService;
        this.eventBus = eventBus;
    }
    /**
     * Executes the GetTimerStatusQuery command.
     *
     * This function retrieves the timer status based on the provided input,
     * publishes a TimerStatusUpdatedEvent with the obtained status, and returns the status.
     *
     * @param command - An instance of GetTimerStatusQuery containing the input data.
     * @returns A promise that resolves to the current timer status as an ITimerStatus object.
     */
    async execute(command) {
        const { input } = command;
        // Retrieve the current timer status using the timer service.
        const status = await this.timerService.getTimerStatus(input);
        // Publish an event indicating that the timer status has been updated.
        this.eventBus.publish(new events_1.TimerStatusUpdatedEvent(status));
        return status;
    }
};
exports.GetTimerStatusHandler = GetTimerStatusHandler;
exports.GetTimerStatusHandler = GetTimerStatusHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.QueryHandler)(get_timer_status_query_1.GetTimerStatusQuery),
    tslib_1.__metadata("design:paramtypes", [timer_service_1.TimerService, cqrs_1.EventBus])
], GetTimerStatusHandler);
//# sourceMappingURL=get-timer-status.handler.js.map