"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityMapService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const moment = require("moment");
const underscore_1 = require("underscore");
let ActivityMapService = class ActivityMapService {
    constructor() { }
    mapByDate(activities) {
        const dailyLogs = this.groupByDate(activities).map((byDateActivity, date) => {
            const sum = this.getDurationSum(byDateActivity);
            const byEmployee = this.groupByEmployee(byDateActivity).map((byEmployeeActivity) => {
                const byProject = this.groupByProject(byEmployeeActivity).map((byProjectActivity) => {
                    const project = byProjectActivity.length > 0 &&
                        byProjectActivity[0]
                        ? byProjectActivity[0].project
                        : null;
                    return {
                        project,
                        activity: byProjectActivity.map((row) => this.mapActivitiesPercentage(row, sum))
                    };
                }).value();
                const employee = byEmployeeActivity.length > 0 &&
                    byEmployeeActivity[0]
                    ? byEmployeeActivity[0].employee
                    : null;
                return {
                    employee,
                    projects: byProject
                };
            }).value();
            return {
                date,
                employees: byEmployee
            };
        }).value();
        return dailyLogs;
    }
    mapByEmployee(activities) {
        const byEmployee = this.groupByEmployee(activities).map((byEmployeeActivity) => {
            const sum = this.getDurationSum(byEmployeeActivity);
            const dailyLogs = this.groupByDate(byEmployeeActivity).map((byDateActivity, date) => {
                const byProject = this.groupByProject(byDateActivity).map((byProjectActivity) => {
                    const project = byProjectActivity.length > 0 &&
                        byProjectActivity[0]
                        ? byProjectActivity[0].project
                        : null;
                    return {
                        project,
                        activity: byProjectActivity.map((row) => this.mapActivitiesPercentage(row, sum))
                    };
                }).value();
                return {
                    date,
                    projects: byProject
                };
            }).value();
            const employee = byEmployeeActivity.length > 0 && byEmployeeActivity[0]
                ? byEmployeeActivity[0].employee
                : null;
            return {
                employee,
                dates: dailyLogs
            };
        }).value();
        return byEmployee;
    }
    mapByProject(activities) {
        const byEmployee = this.groupByProject(activities).map((byProjectActivity) => {
            const sum = this.getDurationSum(byProjectActivity);
            const dailyLogs = this.groupByDate(byProjectActivity).map((byDateActivity, date) => {
                const byProject = this.groupByEmployee(byDateActivity).map((byEmployeeActivity) => {
                    const employee = byEmployeeActivity.length > 0 &&
                        byEmployeeActivity[0]
                        ? byEmployeeActivity[0].employee
                        : null;
                    return {
                        employee,
                        activity: byEmployeeActivity.map((row) => this.mapActivitiesPercentage(row, sum))
                    };
                }).value();
                return {
                    date,
                    employees: byProject
                };
            }).value();
            const project = byProjectActivity.length > 0 && byProjectActivity[0]
                ? byProjectActivity[0].project
                : null;
            return {
                project,
                dates: dailyLogs
            };
        }).value();
        return byEmployee;
    }
    groupByProject(activities) {
        return (0, underscore_1.chain)(activities).groupBy((activity) => {
            return activity.projectId;
        });
    }
    groupByDate(activities) {
        return (0, underscore_1.chain)(activities).groupBy((activity) => {
            return moment.utc(activity.date).format('YYYY-MM-DD');
        });
    }
    groupByEmployee(activities) {
        return (0, underscore_1.chain)(activities).groupBy((activity) => {
            return activity.employeeId;
        });
    }
    mapActivitiesPercentage(activity, sum = 0) {
        activity.duration_percentage = (((parseInt(activity.duration, 10) * 100) / sum).toFixed(2)) || 0;
        return activity;
    }
    getDurationSum(activities) {
        return activities.reduce((iteratee, log) => {
            return iteratee + parseInt(log.duration, 10);
        }, 0);
    }
};
exports.ActivityMapService = ActivityMapService;
exports.ActivityMapService = ActivityMapService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], ActivityMapService);
//# sourceMappingURL=activity.map.service.js.map