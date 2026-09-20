"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeStatisticsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const employee_statistics_service_1 = require("./employee-statistics.service");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const queries_1 = require("./queries");
const dto_1 = require("./dto");
let EmployeeStatisticsController = class EmployeeStatisticsController {
    constructor(employeeStatisticsService, queryBus) {
        this.employeeStatisticsService = employeeStatisticsService;
        this.queryBus = queryBus;
    }
    /**
     *
     * @param data
     * @returns
     */
    async findAggregatedByOrganizationId(data) {
        const { findInput } = data;
        return this.queryBus.execute(new queries_1.AggregatedEmployeeStatisticQuery(findInput));
    }
    /**
     *
     * @param id
     * @param data
     * @returns
     */
    async findAllByEmployeeId(id, data) {
        const { findInput } = data;
        return this.employeeStatisticsService.getStatisticsByEmployeeId(id, findInput);
    }
    /**
     *
     * @param options
     * @returns
     */
    async findAggregatedStatisticsByEmployeeId(options) {
        return await this.queryBus.execute(new queries_1.MonthAggregatedEmployeeStatisticsQuery(options));
    }
    /**
     *
     * @param data
     * @returns
     */
    async findEmployeeStatisticsHistory(data) {
        const { findInput } = data;
        return this.queryBus.execute(new queries_1.EmployeeStatisticsHistoryQuery(findInput));
    }
};
exports.EmployeeStatisticsController = EmployeeStatisticsController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find aggregate for all employees by organization id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Found records' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No records found'
    }),
    (0, common_1.Get)('/aggregate'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeStatisticsController.prototype, "findAggregatedByOrganizationId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find by id' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Found one record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/months/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeStatisticsController.prototype, "findAllByEmployeeId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find Aggregated Statistics by Employee id, valueDate and past N months'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Found one record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/months'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.EmployeeAggregatedStatisticByMonthQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeStatisticsController.prototype, "findAggregatedStatisticsByEmployeeId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find Statistics History by Employee id, valueDate and past N months'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Found one record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/history'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeStatisticsController.prototype, "findEmployeeStatisticsHistory", null);
exports.EmployeeStatisticsController = EmployeeStatisticsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EmployeeStatistics'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/employee-statistics'),
    tslib_1.__metadata("design:paramtypes", [employee_statistics_service_1.EmployeeStatisticsService,
        cqrs_1.QueryBus])
], EmployeeStatisticsController);
//# sourceMappingURL=employee-statistics.controller.js.map