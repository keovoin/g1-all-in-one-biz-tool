"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const guards_1 = require("./../../shared/guards");
const decorators_1 = require("./../../shared/decorators");
const pipes_1 = require("../../shared/pipes");
const timer_service_1 = require("./timer.service");
const dto_1 = require("./dto");
const get_timer_status_query_1 = require("./queries/get-timer-status.query");
const commands_1 = require("./commands");
let TimerController = class TimerController {
    constructor(timerService, _commandBus, _queryBus) {
        this.timerService = timerService;
        this._commandBus = _commandBus;
        this._queryBus = _queryBus;
    }
    /**
     * GET timer today's status.
     *
     * Retrieves the timer status for today based on the provided query parameters.
     *
     * @param query - An object of type TimerStatusQueryDTO containing query parameters.
     * @returns A promise that resolves to an ITimerStatus object representing today's timer status.
     */
    async getTimerStatus(query) {
        return this._queryBus.execute(new get_timer_status_query_1.GetTimerStatusQuery(query));
    }
    /**
     * GET timer last worked status.
     *
     * Retrieves the last worked timer statuses based on the provided query parameters.
     *
     * @param query - An object of type TimerStatusQueryDTO containing query parameters.
     * @returns A promise that resolves to an array of ITimerStatus objects representing the last worked statuses.
     */
    async getTimerWorkedStatus(query) {
        return await this.timerService.getTimerWorkedStatus(query);
    }
    /**
     * Toggle timer.
     *
     * Toggles the timer state (On/Off) based on the provided data.
     *
     * @param entity - A StartTimerDTO object containing the necessary data to toggle the timer.
     * @returns A promise that resolves to an ITimeLog object representing the timer log after toggling,
     *          or null if no log is created.
     */
    async toggleTimer(entity) {
        return await this.timerService.toggleTimeLog(entity);
    }
    /**
     * Start timer endpoint.
     *
     * This endpoint starts the timer by executing the StartTimerCommand.
     *
     * @param entity - A StartTimerDTO object containing the necessary data to start the timer.
     * @returns A promise that resolves to an ITimeLog object representing the timer's log after it has started.
     */
    async startTimer(entity) {
        return this._commandBus.execute(new commands_1.StartTimerCommand(entity));
    }
    /**
     * Stop timer endpoint.
     *
     * This endpoint stops the timer by executing the StopTimerCommand.
     *
     * @param entity - A StopTimerDTO object containing the necessary data to stop the timer.
     * @returns A promise that resolves to an ITimeLog object representing the timer's log after it has stopped,
     *          or null if the timer was not running.
     */
    async stopTimer(entity) {
        return this._commandBus.execute(new commands_1.StopTimerCommand(entity));
    }
};
exports.TimerController = TimerController;
tslib_1.__decorate([
    (0, common_1.Get)('/status'),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.TIME_TRACKER),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.TimerStatusQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimerController.prototype, "getTimerStatus", null);
tslib_1.__decorate([
    (0, common_1.Get)('/status/worked'),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.TIME_TRACKER),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.TimerStatusQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimerController.prototype, "getTimerWorkedStatus", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Toggle timer' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The timer has been successfully On/Off.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)('/toggle'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.StartTimerDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimerController.prototype, "toggleTimer", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Start timer' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The timer has been successfully On.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)('/start'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.StartTimerDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimerController.prototype, "startTimer", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Stop timer' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The timer has been successfully Off.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)('/stop'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.StopTimerDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimerController.prototype, "stopTimer", null);
exports.TimerController = TimerController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Timer Tracker'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.TIME_TRACKER),
    (0, common_1.Controller)('/timesheet/timer'),
    tslib_1.__metadata("design:paramtypes", [timer_service_1.TimerService,
        cqrs_1.CommandBus,
        cqrs_1.QueryBus])
], TimerController);
//# sourceMappingURL=timer.controller.js.map