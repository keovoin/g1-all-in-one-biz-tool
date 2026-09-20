"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetGetHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const timesheet_service_1 = require("./../../../timesheet/timesheet.service");
const timesheet_get_command_1 = require("./../timesheet-get.command");
let TimesheetGetHandler = class TimesheetGetHandler {
    constructor(_timesheetService) {
        this._timesheetService = _timesheetService;
    }
    async execute(command) {
        const { input } = command;
        const { record } = await this._timesheetService.findOneOrFailByOptions(input);
        return record;
    }
};
exports.TimesheetGetHandler = TimesheetGetHandler;
exports.TimesheetGetHandler = TimesheetGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(timesheet_get_command_1.TimesheetGetCommand),
    tslib_1.__metadata("design:paramtypes", [timesheet_service_1.TimeSheetService])
], TimesheetGetHandler);
//# sourceMappingURL=timesheet-get.handler.js.map