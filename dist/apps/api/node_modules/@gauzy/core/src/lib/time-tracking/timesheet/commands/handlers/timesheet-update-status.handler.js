"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetUpdateStatusHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const context_1 = require("./../../../../core/context");
const email_service_1 = require("./../../../../email-send/email.service");
const timesheet_update_status_command_1 = require("../timesheet-update-status.command");
const timesheet_service_1 = require("../../timesheet.service");
let TimesheetUpdateStatusHandler = class TimesheetUpdateStatusHandler {
    constructor(_timeSheetService, _emailService) {
        this._timeSheetService = _timeSheetService;
        this._emailService = _emailService;
    }
    /**
     * Updates the status of one or multiple timesheets.
     *
     * @param {TimesheetUpdateStatusCommand} command - The command containing timesheet IDs and the new status.
     * @returns {Promise<ITimesheet[]>} - The updated timesheets with employee and user details.
     *
     * @throws {NotAcceptableException} - If no timesheet IDs are provided.
     *
     * @description
     * This method updates the status of multiple timesheets based on the provided `ids`.
     * If the status is changed to `APPROVED`, it records the approver's ID and approval timestamp.
     * After updating, it fetches the updated timesheets and sends email notifications to employees.
     */
    async execute(command) {
        const { input } = command;
        let { ids, status, organizationId } = input;
        // Validate input
        if ((0, utils_1.isEmpty)(ids)) {
            throw new common_1.NotAcceptableException('You cannot update timesheet status without providing IDs');
        }
        // Normalize ids to an array
        ids = Array.isArray(ids) ? ids : [ids];
        // Prepare update payload
        const updatePayload = {
            status,
            approvedById: status === contracts_1.TimesheetStatus.APPROVED ? context_1.RequestContext.currentUserId() : undefined,
            approvedAt: status === contracts_1.TimesheetStatus.APPROVED ? new Date() : null
        };
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
        // Update timesheets
        await this._timeSheetService.update({ id: (0, typeorm_1.In)(ids), organizationId, tenantId }, updatePayload);
        // Fetch updated timesheets with employee and user details
        const timesheets = await this._timeSheetService.find({
            relations: { employee: { user: true } },
            where: { id: (0, typeorm_1.In)(ids), organizationId },
            select: {
                employee: {
                    id: true,
                    organizationId: true,
                    user: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        // Send email notifications
        timesheets.forEach((timesheet) => {
            // Retrieve employee and user details
            const employee = timesheet.employee;
            // Send email notification to employee
            if (employee?.user?.email) {
                this._emailService.setTimesheetAction(employee.user.email, timesheet);
            }
        });
        return timesheets;
    }
};
exports.TimesheetUpdateStatusHandler = TimesheetUpdateStatusHandler;
exports.TimesheetUpdateStatusHandler = TimesheetUpdateStatusHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(timesheet_update_status_command_1.TimesheetUpdateStatusCommand),
    tslib_1.__metadata("design:paramtypes", [timesheet_service_1.TimeSheetService, email_service_1.EmailService])
], TimesheetUpdateStatusHandler);
//# sourceMappingURL=timesheet-update-status.handler.js.map