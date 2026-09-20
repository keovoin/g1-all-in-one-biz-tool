"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTimeLogGroupByDateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const underscore_1 = require("underscore");
const moment = require("moment");
const get_time_log_group_by_date_command_1 = require("../get-time-log-group-by-date.command");
const time_log_utils_1 = require("./../../time-log.utils");
let GetTimeLogGroupByDateHandler = class GetTimeLogGroupByDateHandler {
    /**
     * Executes the command to generate a time log report grouped by date.
     * @param command The command containing time logs and other parameters.
     * @returns A Promise that resolves to the generated report grouped by date.
     */
    async execute(command) {
        const { timeLogs, timeZone = moment.tz.guess() } = command;
        const dailyLogs = (0, underscore_1.chain)(timeLogs)
            .groupBy((log) => moment.utc(log.startedAt).tz(timeZone).format('YYYY-MM-DD'))
            .map((byDateLogs, date) => {
            // Calculate average duration for specific date range.
            const avgDuration = (0, time_log_utils_1.calculateAverage)((0, underscore_1.pluck)(byDateLogs, 'duration'));
            // Calculate average activity for specific date range.
            const avgActivity = (0, time_log_utils_1.calculateAverageActivity)((0, underscore_1.chain)(byDateLogs).pluck('timeSlots').flatten(true).value());
            const byProject = (0, underscore_1.chain)(byDateLogs)
                .groupBy('projectId')
                .map((byProjectLogs) => {
                // Extract project information
                const project = byProjectLogs.length > 0 ? byProjectLogs[0].project : null;
                return {
                    project,
                    employeeLogs: this.getGroupByEmployee(byProjectLogs)
                };
            })
                .value();
            return {
                date,
                logs: byProject,
                sum: avgDuration || null,
                activity: parseFloat(parseFloat(avgActivity + '').toFixed(2))
            };
        })
            .value();
        return dailyLogs;
    }
    /**
     * Groups time logs by employee and calculates average duration and activity for each employee.
     * @param logs An array of time logs.
     * @returns An array containing logs grouped by employee with calculated averages.
     */
    getGroupByEmployee(logs) {
        const byEmployee = (0, underscore_1.chain)(logs)
            .groupBy('employeeId')
            .map((timeLogs) => {
            // Calculate average duration of the employee for specific date range.
            const sum = (0, time_log_utils_1.calculateAverage)((0, underscore_1.pluck)(timeLogs, 'duration'));
            // Calculate Average activity of the employee
            const avgActivity = (0, time_log_utils_1.calculateAverageActivity)((0, underscore_1.chain)(timeLogs).pluck('timeSlots').flatten(true).value());
            // Retrieve employee details
            const employee = timeLogs.length > 0 ? timeLogs[0].employee : null;
            const tasks = timeLogs.map((log) => ({
                task: log.task,
                description: log.description,
                duration: log.duration,
                client: log.organizationContact ? log.organizationContact : null
            }));
            return {
                employee,
                sum,
                tasks,
                activity: parseFloat(parseFloat(avgActivity + '').toFixed(2))
            };
        })
            .value();
        return byEmployee;
    }
};
exports.GetTimeLogGroupByDateHandler = GetTimeLogGroupByDateHandler;
exports.GetTimeLogGroupByDateHandler = GetTimeLogGroupByDateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(get_time_log_group_by_date_command_1.GetTimeLogGroupByDateCommand)
], GetTimeLogGroupByDateHandler);
//# sourceMappingURL=get-time-log-group-by-date.handler.js.map