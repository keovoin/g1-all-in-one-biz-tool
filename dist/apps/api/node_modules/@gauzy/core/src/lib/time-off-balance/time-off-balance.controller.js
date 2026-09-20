"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffBalanceController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
const time_off_balance_service_1 = require("./time-off-balance.service");
/**
 * Leave balances per employee, per policy, per year (issue #314).
 *
 * `GET /time-off-balance` and `GET /time-off-balance/me` are the two routes the MCP server's
 * `get_time_off_balance` and `get_my_time_off_balance` tools already call — until now they 404.
 *
 * Reading needs the Time Off view permission, and a caller without `CHANGE_SELECTED_EMPLOYEE`
 * only ever sees their own balances. Changing one needs the Time Off edit permission, because an
 * allocation decides how much leave somebody may take.
 */
let TimeOffBalanceController = class TimeOffBalanceController {
    constructor(timeOffBalanceService) {
        this.timeOffBalanceService = timeOffBalanceService;
    }
    /**
     * The current employee's own leave balances.
     *
     * @param options the policy and year to filter by
     * @returns the caller's balances
     */
    async findMine(options) {
        return this.timeOffBalanceService.findMine(options);
    }
    /**
     * List leave balances, optionally narrowed by employee, policy and year.
     *
     * @param options the filters to apply
     * @returns the matching balances
     */
    async findAll(options) {
        return this.timeOffBalanceService.findAllByFilter(options);
    }
    /**
     * Set the accrued days of one employee/policy/year balance.
     *
     * @param input employee, policy, year and the accrued days
     * @returns the updated balance
     */
    async allocate(input) {
        return this.timeOffBalanceService.allocate(input);
    }
    /**
     * Spend days from a balance, e.g. when a time off request is approved.
     *
     * @param input employee, policy, year and how many days to deduct
     * @returns the balance after the deduction
     */
    async deduct(input) {
        return this.timeOffBalanceService.deduct(input);
    }
    /**
     * Give days back to a balance, e.g. when an approved request is cancelled.
     *
     * @param input employee, policy, year and how many days to restore
     * @returns the balance after the reversal
     */
    async reverse(input) {
        return this.timeOffBalanceService.reverse(input);
    }
    /**
     * Roll unused days of one policy from one year into the next.
     *
     * @param input policy, source year, target year and an optional cap
     * @returns how many employee balances were rolled over
     */
    async carryForward(input) {
        return this.timeOffBalanceService.carryForward(input);
    }
};
exports.TimeOffBalanceController = TimeOffBalanceController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Find the current employee's leave balances" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Found leave balances' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.TIME_OFF_VIEW),
    (0, common_1.Get)('/me'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.TimeOffBalanceQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffBalanceController.prototype, "findMine", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find leave balances' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Found leave balances' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.TIME_OFF_VIEW),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.TimeOffBalanceQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffBalanceController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Allocate accrued leave days' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The balance has been allocated.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Employee or policy not found' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_EDIT),
    (0, common_1.Post)('/allocate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.AllocateTimeOffBalanceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffBalanceController.prototype, "allocate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Deduct leave days from a balance' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The balance has been deducted.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Insufficient leave balance' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_EDIT),
    (0, common_1.Post)('/deduct'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.AdjustTimeOffBalanceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffBalanceController.prototype, "deduct", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Restore leave days to a balance' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The balance has been restored.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Balance not found' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_EDIT),
    (0, common_1.Post)('/reverse'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.AdjustTimeOffBalanceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffBalanceController.prototype, "reverse", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Carry unused leave days forward into the next year' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The balances have been carried forward.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_EDIT),
    (0, common_1.Post)('/carry-forward'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CarryForwardTimeOffBalanceDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffBalanceController.prototype, "carryForward", null);
exports.TimeOffBalanceController = TimeOffBalanceController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('TimeOffBalance'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_EDIT),
    (0, common_1.Controller)('/time-off-balance'),
    tslib_1.__metadata("design:paramtypes", [time_off_balance_service_1.TimeOffBalanceService])
], TimeOffBalanceController);
//# sourceMappingURL=time-off-balance.controller.js.map