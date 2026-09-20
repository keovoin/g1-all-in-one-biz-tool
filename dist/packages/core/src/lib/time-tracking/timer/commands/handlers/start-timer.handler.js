"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartTimerHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const commands_1 = require("../../commands");
const events_1 = require("../../events");
const timer_service_1 = require("../../timer.service");
let StartTimerHandler = class StartTimerHandler {
    constructor(timerService, eventBus) {
        this.timerService = timerService;
        this.eventBus = eventBus;
    }
    /**
     * Executes the StartTimerCommand.
     *
     * This function starts a new timer using the provided command input,
     * publishes a TimerStartedEvent with the generated time log,
     * and returns the time log.
     *
     * @param command - An instance of StartTimerCommand containing the input data to start the timer.
     * @returns A promise that resolves to an ITimeLog representing the started timer's log.
     */
    async execute(command) {
        const { input } = command;
        // Start the timer and retrieve the time log.
        const timeLog = await this.timerService.startTimer(input);
        // Publish an event indicating that the timer has started.
        this.eventBus.publish(new events_1.TimerStartedEvent(timeLog));
        return timeLog;
    }
};
exports.StartTimerHandler = StartTimerHandler;
exports.StartTimerHandler = StartTimerHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.CommandHandler)(commands_1.StartTimerCommand),
    tslib_1.__metadata("design:paramtypes", [timer_service_1.TimerService, cqrs_1.EventBus])
], StartTimerHandler);
//# sourceMappingURL=start-timer.handler.js.map