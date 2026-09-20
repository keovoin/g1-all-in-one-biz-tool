"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetSubmitHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const utils_1 = require("@gauzy/utils");
const email_service_1 = require("./../../../../email-send/email.service");
const timesheet_submit_command_1 = require("../timesheet-submit.command");
const timesheet_service_1 = require("../../timesheet.service");
let TimesheetSubmitHandler = class TimesheetSubmitHandler {
    constructor(_timeSheetService, _emailService) {
        this._timeSheetService = _timeSheetService;
        this._emailService = _emailService;
    }
    /**
     * Submits multiple timesheets by updating their status and sending notifications.
     *
     * @param {TimesheetSubmitCommand} command - The command containing timesheet IDs and submission status.
     * @returns {Promise<ITimesheet[]>} - A promise resolving to the submitted timesheets.
     *
     * @throws {NotAcceptableException} - If no timesheet IDs are provided.
     *
     * @description
     * This method updates the submission status of multiple timesheets. If the status is 'submit',
     * it marks them as submitted by setting `submittedAt` to the current date. It then retrieves
     * the updated timesheets and sends email notifications to employees.
     */
    async execute(command) {
        const { input } = command;
        let { ids, status, organizationId } = input;
        // Validate input
        if ((0, utils_1.isEmpty)(ids)) {
            throw new common_1.NotAcceptableException('You cannot submit a timesheet without providing IDs');
        }
        // Normalize `ids` to always be an array
        ids = Array.isArray(ids) ? ids : [ids];
        // Define update payload
        const updatePayload = { submittedAt: status === 'submit' ? new Date() : null };
        // Update timesheets
        await this._timeSheetService.update({ id: (0, typeorm_1.In)(ids), organizationId }, updatePayload);
        // Fetch updated timesheets with employee and user details
        const timesheets = await this._timeSheetService.find({
            relations: { employee: { user: true } },
            where: {
                id: (0, typeorm_1.In)(ids),
                organizationId,
                submittedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)())
            },
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
        if (status === 'submit') {
            timesheets.forEach((timesheet) => {
                // Retrieve employee and user details
                const employee = timesheet.employee;
                // Send email notification to employee
                if (employee?.user?.email) {
                    this._emailService.timesheetSubmit(employee.user.email, timesheet);
                }
            });
        }
        return timesheets;
    }
};
exports.TimesheetSubmitHandler = TimesheetSubmitHandler;
exports.TimesheetSubmitHandler = TimesheetSubmitHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(timesheet_submit_command_1.TimesheetSubmitCommand),
    tslib_1.__metadata("design:paramtypes", [timesheet_service_1.TimeSheetService, email_service_1.EmailService])
], TimesheetSubmitHandler);
//# sourceMappingURL=timesheet-submit.handler.js.map