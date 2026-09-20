"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMapService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const moment = require("moment");
const underscore_1 = require("underscore");
let PaymentMapService = class PaymentMapService {
    constructor() { }
    mapByDate(payments) {
        const dailyLogs = this.groupByDate(payments).map((byDatePayment, date) => {
            const sum = this.getDurationSum(byDatePayment);
            const byClient = this.groupByClient(byDatePayment).map((byClientPayment) => {
                const byProject = this.groupByProject(byClientPayment).map((byProjectPayment) => {
                    const project = byProjectPayment.length > 0 &&
                        byProjectPayment[0]
                        ? byProjectPayment[0].project
                        : null;
                    return {
                        project,
                        payments: byProjectPayment.map((row) => this.mapPaymentPercentage(row, sum))
                    };
                })
                    .value();
                const employee = byClientPayment.length > 0 && byClientPayment[0]
                    ? byClientPayment[0].employee
                    : null;
                return {
                    employee,
                    projects: byProject
                };
            })
                .value();
            return {
                date,
                clients: byClient
            };
        })
            .value();
        return dailyLogs;
    }
    mapByClient(payments) {
        const byClient = this.groupByClient(payments).map((byClientPayment) => {
            const sum = this.getDurationSum(byClientPayment);
            const dailyLogs = this.groupByDate(byClientPayment).map((byDatePayment, date) => {
                const byProject = this.groupByProject(byDatePayment).map((byProjectPayment) => {
                    const project = byProjectPayment.length > 0 &&
                        byProjectPayment[0]
                        ? byProjectPayment[0].project
                        : null;
                    return {
                        project,
                        payments: byProjectPayment.map((row) => this.mapPaymentPercentage(row, sum))
                    };
                })
                    .value();
                return {
                    date,
                    projects: byProject
                };
            })
                .value();
            const client = byClientPayment.length > 0 && byClientPayment[0]
                ? byClientPayment[0].organizationContact
                : null;
            return {
                client,
                dates: dailyLogs
            };
        })
            .value();
        return byClient;
    }
    mapByProject(payments) {
        const byClient = this.groupByProject(payments).map((byProjectPayment) => {
            const sum = this.getDurationSum(byProjectPayment);
            const dailyLogs = this.groupByDate(byProjectPayment).map((byDatePayment, date) => {
                const byProject = this.groupByClient(byDatePayment).map((byClientPayment) => {
                    const employee = byClientPayment.length > 0 &&
                        byClientPayment[0]
                        ? byClientPayment[0].employee
                        : null;
                    return {
                        employee,
                        payments: byClientPayment.map((row) => this.mapPaymentPercentage(row, sum))
                    };
                })
                    .value();
                return {
                    date,
                    clients: byProject
                };
            })
                .value();
            const project = byProjectPayment.length > 0 && byProjectPayment[0]
                ? byProjectPayment[0].project
                : null;
            return {
                project,
                dates: dailyLogs
            };
        })
            .value();
        return byClient;
    }
    groupByProject(payments) {
        return (0, underscore_1.chain)(payments).groupBy((payment) => {
            return payment.projectId;
        });
    }
    groupByDate(payments) {
        return (0, underscore_1.chain)(payments).groupBy((payment) => {
            return moment.utc(payment.paymentDate).add(1, 'day').format('YYYY-MM-DD');
        });
    }
    groupByClient(payments) {
        return (0, underscore_1.chain)(payments).groupBy((payment) => {
            return payment.organizationContactId;
        });
    }
    mapPaymentPercentage(payments, sum = 0) {
        payments.duration_percentage =
            (parseInt(payments.duration, 10) * 100) / sum;
        return payments;
    }
    getDurationSum(payments) {
        return payments.reduce((iteratee, log) => {
            return iteratee + parseInt(log.duration, 10);
        }, 0);
    }
};
exports.PaymentMapService = PaymentMapService;
exports.PaymentMapService = PaymentMapService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], PaymentMapService);
//# sourceMappingURL=payment.map.service.js.map