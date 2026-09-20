"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRunService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("./../core/context");
const crud_1 = require("./../core/crud");
const internal_1 = require("./../core/entities/internal");
const payroll_item_entity_1 = require("./../payroll-item/payroll-item.entity");
const type_orm_payroll_item_repository_1 = require("./../payroll-item/repository/type-orm-payroll-item.repository");
const payroll_run_entity_1 = require("./payroll-run.entity");
const mikro_orm_payroll_run_repository_1 = require("./repository/mikro-orm-payroll-run.repository");
const type_orm_payroll_run_repository_1 = require("./repository/type-orm-payroll-run.repository");
/** States a run may still be edited or cancelled from. */
const OPEN_STATUSES = [
    contracts_1.PayrollRunStatusEnum.DRAFT,
    contracts_1.PayrollRunStatusEnum.PENDING_APPROVAL,
    contracts_1.PayrollRunStatusEnum.APPROVED,
    contracts_1.PayrollRunStatusEnum.PROCESSING
];
/**
 * Payroll runs and their line items (issue #2453).
 *
 * Two rules hold everywhere in this service:
 *
 *  1. Every lookup is scoped by `tenantId` AND `organizationId`. A payroll run holds what people
 *     are paid; a lookup by id alone would let any authenticated user of any tenant read or move
 *     another company's payroll.
 *  2. Totals are never accepted from a caller. They are recomputed from the run's items, in
 *     integer cents, at the moment the run is processed. Summing `0.1 + 0.2` in binary floating
 *     point does not give `0.3`, and payroll is the last place to discover that.
 */
let PayrollRunService = class PayrollRunService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmPayrollRunRepository, mikroOrmPayrollRunRepository, typeOrmPayrollItemRepository) {
        super(typeOrmPayrollRunRepository, mikroOrmPayrollRunRepository);
        this.typeOrmPayrollRunRepository = typeOrmPayrollRunRepository;
        this.mikroOrmPayrollRunRepository = mikroOrmPayrollRunRepository;
        this.typeOrmPayrollItemRepository = typeOrmPayrollItemRepository;
    }
    /**
     * Open a new payroll run in `DRAFT`.
     *
     * @param input the pay period, pay date, frequency and currency
     * @returns the created run
     */
    async createRun(input) {
        const { periodStart, periodEnd, payDate } = input;
        if (new Date(periodEnd) < new Date(periodStart)) {
            throw new common_1.BadRequestException('`periodEnd` cannot be before `periodStart`');
        }
        if (new Date(payDate) < new Date(periodStart)) {
            throw new common_1.BadRequestException('`payDate` cannot be before `periodStart`');
        }
        return super.create({
            ...input,
            tenantId: context_1.RequestContext.currentTenantId() ?? input.tenantId,
            status: contracts_1.PayrollRunStatusEnum.DRAFT,
            totalGross: 0,
            totalDeductions: 0,
            totalNet: 0
        });
    }
    /**
     * List payroll runs of an organization, newest period first.
     *
     * @param filter status, frequency, period range and pagination
     * @returns the matching runs and the total row count
     */
    async findAllRuns(filter) {
        const { organizationId, status, frequency, periodStart, periodEnd, page, limit } = filter;
        const tenantId = context_1.RequestContext.currentTenantId() ?? filter.tenantId;
        const where = { tenantId, organizationId };
        if (status) {
            where.status = status;
        }
        if (frequency) {
            where.frequency = frequency;
        }
        // Each bound works on its own; requiring both silently ignored a one-sided filter.
        if (periodStart && periodEnd) {
            where.periodStart = (0, typeorm_1.Between)(periodStart, periodEnd);
        }
        else if (periodStart) {
            where.periodStart = (0, typeorm_1.MoreThanOrEqual)(periodStart);
        }
        else if (periodEnd) {
            where.periodStart = (0, typeorm_1.LessThanOrEqual)(periodEnd);
        }
        // `page` is 1-based and `limit` is the page size, matching `IPaginationInput` everywhere
        // else in the codebase; TypeORM wants an offset.
        const take = limit ?? 10;
        const skip = Math.max(0, (page ?? 1) - 1) * take;
        const [items, total] = await this.typeOrmRepository.findAndCount({
            where,
            order: { periodStart: 'DESC' },
            skip,
            take
        });
        return { items, total };
    }
    /**
     * Read one run with its items.
     *
     * @param id the run to read
     * @param organizationId the organization the run belongs to
     * @returns the run
     */
    async findOneRun(id, organizationId) {
        const run = await this.typeOrmRepository.findOne({
            where: { id, tenantId: context_1.RequestContext.currentTenantId(), organizationId },
            relations: { items: true }
        });
        if (!run) {
            throw new common_1.NotFoundException(`Payroll run with id '${id}' was not found`);
        }
        return run;
    }
    /**
     * Edit the period, pay date, frequency, currency or notes of a run that has not been paid.
     *
     * @param id the run to update
     * @param organizationId the organization the run belongs to
     * @param input the fields to change
     * @returns the updated run
     */
    async updateRun(id, organizationId, input) {
        const run = await this.findOneRun(id, organizationId);
        if (!OPEN_STATUSES.includes(run.status)) {
            throw new common_1.BadRequestException(`A payroll run with status ${run.status} can no longer be edited`);
        }
        Object.assign(run, input);
        if (new Date(run.periodEnd) < new Date(run.periodStart)) {
            throw new common_1.BadRequestException('`periodEnd` cannot be before `periodStart`');
        }
        return this.typeOrmRepository.save(run);
    }
    /**
     * Move a run from `DRAFT` to `PENDING_APPROVAL`.
     *
     * @param id the run to submit
     * @param organizationId the organization the run belongs to
     * @returns the submitted run
     */
    async submitForApproval(id, organizationId) {
        // Refresh the totals first: the approver has to see what they are signing off.
        const run = await this.findOneRun(id, organizationId);
        await this.recalculateTotals(this.typeOrmRepository.manager, run);
        return this.transition(id, organizationId, [contracts_1.PayrollRunStatusEnum.DRAFT], contracts_1.PayrollRunStatusEnum.PENDING_APPROVAL);
    }
    /**
     * Move a run from `PENDING_APPROVAL` to `APPROVED`.
     *
     * @param id the run to approve
     * @param organizationId the organization the run belongs to
     * @returns the approved run
     */
    async approve(id, organizationId) {
        return this.transition(id, organizationId, [contracts_1.PayrollRunStatusEnum.PENDING_APPROVAL], contracts_1.PayrollRunStatusEnum.APPROVED, { approvedAt: new Date(), approvedByUserId: context_1.RequestContext.currentUserId() });
    }
    /**
     * Recompute the totals from the run's items and mark it `PAID`.
     *
     * Totals and status move together inside one transaction, so a run can never end up marked
     * paid with stale totals.
     *
     * @param id the run to process
     * @param organizationId the organization the run belongs to
     * @returns the processed run
     */
    async process(id, organizationId) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const run = await this.findOneRun(id, organizationId);
        if (run.status !== contracts_1.PayrollRunStatusEnum.APPROVED && run.status !== contracts_1.PayrollRunStatusEnum.PROCESSING) {
            throw new common_1.BadRequestException(`Only an approved payroll run can be processed, this one is ${run.status}`);
        }
        await this.typeOrmRepository.manager.transaction(async (manager) => {
            // Claim the transition first, so a second concurrent call cannot also pay this run.
            const claimed = await manager.update(payroll_run_entity_1.PayrollRun, {
                id,
                tenantId,
                organizationId,
                status: (0, typeorm_1.In)([contracts_1.PayrollRunStatusEnum.APPROVED, contracts_1.PayrollRunStatusEnum.PROCESSING])
            }, { status: contracts_1.PayrollRunStatusEnum.PAID, paidAt: new Date() });
            if (!claimed.affected) {
                throw new common_1.BadRequestException('This payroll run has already been processed');
            }
            const fresh = await manager.findOne(payroll_run_entity_1.PayrollRun, {
                where: { id, tenantId, organizationId }
            });
            await this.recalculateTotals(manager, fresh);
        });
        return this.findOneRun(id, organizationId);
    }
    /**
     * Cancel a run that has not been paid. Cancelling an already cancelled run is a no-op.
     *
     * @param id the run to cancel
     * @param organizationId the organization the run belongs to
     * @returns the cancelled run
     */
    async cancel(id, organizationId) {
        const run = await this.findOneRun(id, organizationId);
        if (run.status === contracts_1.PayrollRunStatusEnum.CANCELLED) {
            return run;
        }
        if (run.status === contracts_1.PayrollRunStatusEnum.PAID) {
            throw new common_1.BadRequestException('A paid payroll run cannot be cancelled');
        }
        run.status = contracts_1.PayrollRunStatusEnum.CANCELLED;
        return this.typeOrmRepository.save(run);
    }
    /**
     * Add an earning or deduction line to a run that has not been paid.
     *
     * @param payrollRunId the run to add the line to
     * @param input the line to add
     * @returns the created line
     */
    async addItem(payrollRunId, input) {
        const { organizationId, employeeId } = input;
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        const run = await this.findOneRun(payrollRunId, organizationId);
        if (run.status !== contracts_1.PayrollRunStatusEnum.DRAFT) {
            throw new common_1.BadRequestException(`Line items can only be added while a payroll run is a draft, this one is ${run.status}`);
        }
        // The employee must belong to the same organization, or a caller could pay somebody
        // outside their own company out of their own payroll run.
        const employees = await this.typeOrmRepository.manager.count(internal_1.Employee, {
            where: { id: employeeId, tenantId, organizationId }
        });
        if (employees === 0) {
            throw new common_1.NotFoundException(`Employee with id '${employeeId}' was not found in this organization`);
        }
        const item = this.typeOrmPayrollItemRepository.create({
            ...input,
            payrollRunId,
            tenantId,
            taxable: input.taxable ?? true
        });
        const saved = await this.typeOrmPayrollItemRepository.save(item);
        await this.recalculateTotals(this.typeOrmRepository.manager, run);
        return saved;
    }
    /**
     * Remove a line from a run that has not been paid.
     *
     * @param payrollRunId the run the line belongs to
     * @param itemId the line to remove
     * @param organizationId the organization the run belongs to
     * @returns the delete result
     */
    async removeItem(payrollRunId, itemId, organizationId) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const run = await this.findOneRun(payrollRunId, organizationId);
        if (run.status !== contracts_1.PayrollRunStatusEnum.DRAFT) {
            throw new common_1.BadRequestException(`Line items can only be removed while a payroll run is a draft, this one is ${run.status}`);
        }
        const result = await this.typeOrmPayrollItemRepository.delete({
            id: itemId,
            payrollRunId,
            tenantId,
            organizationId
        });
        if (!result.affected) {
            throw new common_1.NotFoundException(`Payroll item with id '${itemId}' was not found in this payroll run`);
        }
        await this.recalculateTotals(this.typeOrmRepository.manager, run);
        return result;
    }
    /**
     * Break a run down into what each employee earns, is deducted and takes home.
     *
     * @param id the run to summarize
     * @param organizationId the organization the run belongs to
     * @returns one summary per employee
     */
    async getSummaryByRun(id, organizationId) {
        const run = await this.findOneRun(id, organizationId);
        const summaries = new Map();
        for (const item of run.items ?? []) {
            if (!item.employeeId) {
                continue;
            }
            if (!summaries.has(item.employeeId)) {
                summaries.set(item.employeeId, {
                    employeeId: item.employeeId,
                    employee: item.employee,
                    periodStart: run.periodStart,
                    periodEnd: run.periodEnd,
                    grossPay: 0,
                    totalDeductions: 0,
                    netPay: 0,
                    currency: run.currency,
                    grossCents: 0,
                    deductionCents: 0
                });
            }
            const summary = summaries.get(item.employeeId);
            const cents = Math.round(Number(item.amount) * 100);
            if (item.category === contracts_1.PayrollItemCategoryEnum.EARNING) {
                summary.grossCents += cents;
            }
            else {
                summary.deductionCents += cents;
            }
        }
        return Array.from(summaries.values()).map(({ grossCents, deductionCents, ...summary }) => ({
            ...summary,
            grossPay: grossCents / 100,
            totalDeductions: deductionCents / 100,
            netPay: (grossCents - deductionCents) / 100
        }));
    }
    /**
     * Totals across every paid run of an organization, grouped by currency.
     *
     * Runs are grouped rather than summed together because adding amounts denominated in
     * different currencies produces a number that means nothing.
     *
     * @param organizationId the organization to report on
     * @returns one set of totals per currency
     */
    async getStatistics(organizationId) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const runs = await this.typeOrmRepository.find({
            where: { tenantId, organizationId, status: contracts_1.PayrollRunStatusEnum.PAID },
            relations: { items: true }
        });
        const byCurrency = new Map();
        for (const run of runs) {
            if (!byCurrency.has(run.currency)) {
                byCurrency.set(run.currency, {
                    totalRuns: 0,
                    totalEmployeesPaid: 0,
                    totalGrossPaid: 0,
                    totalDeductions: 0,
                    totalNetPaid: 0,
                    currency: run.currency,
                    grossCents: 0,
                    deductionCents: 0,
                    employees: new Set()
                });
            }
            const stats = byCurrency.get(run.currency);
            stats.totalRuns++;
            stats.grossCents += Math.round(Number(run.totalGross) * 100);
            stats.deductionCents += Math.round(Number(run.totalDeductions) * 100);
            for (const item of run.items ?? []) {
                if (item.employeeId) {
                    stats.employees.add(item.employeeId);
                }
            }
        }
        return Array.from(byCurrency.values()).map(({ grossCents, deductionCents, employees, ...stats }) => ({
            ...stats,
            totalEmployeesPaid: employees.size,
            totalGrossPaid: grossCents / 100,
            totalDeductions: deductionCents / 100,
            totalNetPaid: (grossCents - deductionCents) / 100
        }));
    }
    /**
     * Move a run from one of `from` to `to`, or refuse.
     */
    async transition(id, organizationId, from, to, extra = {}) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const run = await this.findOneRun(id, organizationId);
        if (!from.includes(run.status)) {
            throw new common_1.BadRequestException(`A payroll run must be ${from.join(' or ')} to become ${to}, this one is ${run.status}`);
        }
        // Claim the transition in a single statement whose WHERE still names the state we read.
        // A plain read-then-save lets two concurrent approvals both observe APPROVED and both
        // write PAID — for payroll, a double payment.
        const claimed = await this.typeOrmRepository.update({ id, tenantId, organizationId, status: (0, typeorm_1.In)(from) }, { status: to, ...extra });
        if (!claimed.affected) {
            throw new common_1.BadRequestException('This payroll run has already moved on to another state');
        }
        return this.findOneRun(id, organizationId);
    }
    /**
     * Recompute a run's totals from its line items, in integer cents, and persist them.
     *
     * Called on every item mutation as well as at process() time, so an approver is never asked
     * to sign off a run that still reads 0.00.
     *
     * @param manager the entity manager to run on (transactional at process() time)
     * @param run the run to recompute
     * @returns the run with fresh totals
     */
    async recalculateTotals(manager, run) {
        const items = await manager.find(payroll_item_entity_1.PayrollItem, {
            where: {
                payrollRunId: run.id,
                tenantId: run.tenantId,
                organizationId: run.organizationId
            }
        });
        // Sum in integer cents: binary floating point cannot represent most decimal amounts
        // exactly, and the error compounds over a payroll run's worth of line items.
        let grossCents = 0;
        let deductionCents = 0;
        for (const item of items) {
            const cents = Math.round(Number(item.amount) * 100);
            if (item.category === contracts_1.PayrollItemCategoryEnum.EARNING) {
                grossCents += cents;
            }
            else {
                deductionCents += cents;
            }
        }
        run.totalGross = grossCents / 100;
        run.totalDeductions = deductionCents / 100;
        run.totalNet = (grossCents - deductionCents) / 100;
        return manager.save(payroll_run_entity_1.PayrollRun, run);
    }
};
exports.PayrollRunService = PayrollRunService;
exports.PayrollRunService = PayrollRunService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_payroll_run_repository_1.TypeOrmPayrollRunRepository,
        mikro_orm_payroll_run_repository_1.MikroOrmPayrollRunRepository,
        type_orm_payroll_item_repository_1.TypeOrmPayrollItemRepository])
], PayrollRunService);
//# sourceMappingURL=payroll-run.service.js.map