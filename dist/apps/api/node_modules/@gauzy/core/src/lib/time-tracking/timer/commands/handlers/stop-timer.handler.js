"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopTimerHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const commands_1 = require("../../commands");
const events_1 = require("../../events");
const timer_service_1 = require("../../timer.service");
let StopTimerHandler = class StopTimerHandler {
    constructor(timerService, eventBus) {
        this.timerService = timerService;
        this.eventBus = eventBus;
    }
    /**
     * Executes the StopTimerCommand.
     *
     * This function stops the timer using the provided command input,
     * publishes a TimerStoppedEvent with the updated time log, and returns the time log.
     *
     * @param command - An instance of StopTimerCommand containing the input data for stopping the timer.
     * @returns A promise that resolves to an ITimeLog representing the stopped timer's log.
     */
    async execute(command) {
        const { input } = command;
        // Stop the timer and retrieve the time log.
        const timeLog = await this.timerService.stopTimer(input);
        // Publish an event indicating that the timer has been stopped.
        this.eventBus.publish(new events_1.TimerStoppedEvent(timeLog));
        return timeLog;
    }
};
exports.StopTimerHandler = StopTimerHandler;
exports.StopTimerHandler = StopTimerHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.CommandHandler)(commands_1.StopTimerCommand),
    tslib_1.__metadata("design:paramtypes", [timer_service_1.TimerService, cqrs_1.EventBus])
], StopTimerHandler);
//# sourceMappingURL=stop-timer.handler.js.map