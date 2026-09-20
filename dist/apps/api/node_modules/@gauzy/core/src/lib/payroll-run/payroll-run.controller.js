"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRunController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
const payroll_run_service_1 = require("./payroll-run.service");
/**
 * Payroll runs and their line items (issue #2453).
 *
 * Reading needs `ORG_PAYROLL_VIEW`, editing needs `ORG_PAYROLL_EDIT`, and approving or paying a
 * run needs the separate `ORG_PAYROLL_APPROVE` — the person who prepares a payroll run should not
 * be able to approve their own work unaided.
 */
let PayrollRunController = class PayrollRunController {
    constructor(payrollRunService) {
        this.payrollRunService = payrollRunService;
    }
    /**
     * Totals across every paid payroll run of an organization, grouped by currency.
     *
     * @param organizationId the organization to report on
     * @returns one set of totals per currency
     */
    async getStatistics(organizationId) {
        return this.payrollRunService.getStatistics(organizationId);
    }
    /**
     * List payroll runs, newest pay period first.
     *
     * @param options status, frequency, period range and pagination
     * @returns the matching runs
     */
    async findAll(options) {
        return this.payrollRunService.findAllRuns(options);
    }
    /**
     * Read one payroll run with its line items.
     *
     * @param id the run to read
     * @param organizationId the organization the run belongs to
     * @returns the run
     */
    async findById(id, organizationId) {
        return this.payrollRunService.findOneRun(id, organizationId);
    }
    /**
     * Break a run down into what each employee earns, is deducted and takes home.
     *
     * @param id the run to summarize
     * @param organizationId the organization the run belongs to
     * @returns one summary per employee
     */
    async getSummary(id, organizationId) {
        return this.payrollRunService.getSummaryByRun(id, organizationId);
    }
    /**
     * Open a new payroll run in `DRAFT`.
     *
     * @param entity the pay period, pay date, frequency and currency
     * @returns the created run
     */
    async create(entity) {
        return this.payrollRunService.createRun(entity);
    }
    /**
     * Edit a payroll run that has not been paid.
     *
     * @param id the run to update
     * @param organizationId the organization the run belongs to
     * @param entity the fields to change
     * @returns the updated run
     */
    async update(id, organizationId, entity) {
        return this.payrollRunService.updateRun(id, organizationId, entity);
    }
    /**
     * Move a draft run to `PENDING_APPROVAL`.
     *
     * @param id the run to submit
     * @param organizationId the organization the run belongs to
     * @returns the submitted run
     */
    async submitForApproval(id, organizationId) {
        return this.payrollRunService.submitForApproval(id, organizationId);
    }
    /**
     * Approve a run that is pending approval.
     *
     * @param id the run to approve
     * @param organizationId the organization the run belongs to
     * @returns the approved run
     */
    async approve(id, organizationId) {
        return this.payrollRunService.approve(id, organizationId);
    }
    /**
     * Recompute the totals of an approved run and mark it paid.
     *
     * @param id the run to process
     * @param organizationId the organization the run belongs to
     * @returns the processed run
     */
    async process(id, organizationId) {
        return this.payrollRunService.process(id, organizationId);
    }
    /**
     * Cancel a run that has not been paid.
     *
     * @param id the run to cancel
     * @param organizationId the organization the run belongs to
     * @returns the cancelled run
     */
    async cancel(id, organizationId) {
        return this.payrollRunService.cancel(id, organizationId);
    }
    /**
     * Add an earning or deduction line to a draft run.
     *
     * @param id the run to add the line to
     * @param entity the line to add
     * @returns the created line
     */
    async addItem(id, entity) {
        return this.payrollRunService.addItem(id, entity);
    }
    /**
     * Remove a line from a draft run.
     *
     * @param id the run the line belongs to
     * @param itemId the line to remove
     * @param organizationId the organization the run belongs to
     * @returns the delete result
     */
    async removeItem(id, itemId, organizationId) {
        return this.payrollRunService.removeItem(id, itemId, organizationId);
    }
};
exports.PayrollRunController = PayrollRunController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get payroll statistics' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Payroll statistics retrieved' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_VIEW),
    (0, common_1.Get)('/statistics'),
    tslib_1.__param(0, (0, common_1.Query)('organizationId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PayrollRunController.prototype, "getStatistics", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find payroll runs' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Found payroll runs' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_VIEW),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.PayrollRunQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PayrollRunController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find a payroll run by id' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Found the payroll run' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Record not found' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_VIEW),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PayrollRunController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get the per-employee summary of a payroll run' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Payroll summary retrieved' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_VIEW),
    (0, common_1.Get)('/:id/summary'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PayrollRunController.prototype, "getSummary", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a payroll run' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'The payroll run has been created.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input, check the response body for details' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_EDIT),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreatePayrollRunDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PayrollRunController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a payroll run' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'The payroll run has been updated.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Record not found' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_EDIT),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, dto_1.UpdatePayrollRunDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PayrollRunController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Submit a payroll run for approval' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The payroll run has been submitted.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_EDIT),
    (0, common_1.Put)('/:id/submit'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PayrollRunController.prototype, "submitForApproval", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Approve a payroll run' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The payroll run has been approved.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_APPROVE),
    (0, common_1.Put)('/:id/approve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PayrollRunController.prototype, "approve", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Process a payroll run and mark it paid' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The payroll run has been processed.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_APPROVE),
    (0, common_1.Put)('/:id/process'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PayrollRunController.prototype, "process", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a payroll run' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The payroll run has been cancelled.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_EDIT),
    (0, common_1.Put)('/:id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PayrollRunController.prototype, "cancel", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add a line item to a payroll run' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'The line item has been added.' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_EDIT),
    (0, common_1.Post)('/:id/items'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.CreatePayrollItemDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PayrollRunController.prototype, "addItem", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remove a line item from a payroll run' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT, description: 'The line item has been removed.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Record not found' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_EDIT),
    (0, common_1.Delete)('/:id/items/:itemId'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('itemId', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(2, (0, common_1.Query)('organizationId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PayrollRunController.prototype, "removeItem", null);
exports.PayrollRunController = PayrollRunController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('PayrollRun'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_PAYROLL_EDIT),
    (0, common_1.Controller)('/payroll-run'),
    tslib_1.__metadata("design:paramtypes", [payroll_run_service_1.PayrollRunService])
], PayrollRunController);
//# sourceMappingURL=payroll-run.controller.js.map