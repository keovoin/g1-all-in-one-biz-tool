"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const __1 = require("..");
const timesheet_service_1 = require("./../../timesheet.service");
const context_1 = require("../../../../core/context");
let TimesheetCreateHandler = class TimesheetCreateHandler {
    constructor(_timesheetService) {
        this._timesheetService = _timesheetService;
    }
    async execute(command) {
        const { input } = command;
        const { employeeId, duration, keyboard, mouse, overall, startedAt, stoppedAt, organizationId } = input;
        try {
            return await this._timesheetService.create({
                employeeId,
                duration,
                keyboard,
                mouse,
                overall,
                startedAt,
                stoppedAt,
                organizationId,
                tenantId: context_1.RequestContext.currentTenantId()
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Can\'t create timesheet for employee-${employeeId} of organization-${organizationId}`);
        }
    }
};
exports.TimesheetCreateHandler = TimesheetCreateHandler;
exports.TimesheetCreateHandler = TimesheetCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(__1.TimesheetCreateCommand),
    tslib_1.__metadata("design:paramtypes", [timesheet_service_1.TimeSheetService])
], TimesheetCreateHandler);
//# sourceMappingURL=timesheet-create.handler.js.map