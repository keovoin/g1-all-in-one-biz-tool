import { DeleteResult } from 'typeorm';
import { ID, IPagination, IPayrollItem, IPayrollItemCreateInput, IPayrollRun, IPayrollRunCreateInput, IPayrollRunFindInput, IPayrollRunUpdateInput, IPayrollStatistics, IPayrollSummary } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { TypeOrmPayrollItemRepository } from './../payroll-item/repository/type-orm-payroll-item.repository';
import { PayrollRun } from './payroll-run.entity';
import { MikroOrmPayrollRunRepository } from './repository/mikro-orm-payroll-run.repository';
import { TypeOrmPayrollRunRepository } from './repository/type-orm-payroll-run.repository';
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
export declare class PayrollRunService extends TenantAwareCrudService<PayrollRun> {
    readonly typeOrmPayrollRunRepository: TypeOrmPayrollRunRepository;
    readonly mikroOrmPayrollRunRepository: MikroOrmPayrollRunRepository;
    private readonly typeOrmPayrollItemRepository;
    constructor(typeOrmPayrollRunRepository: TypeOrmPayrollRunRepository, mikroOrmPayrollRunRepository: MikroOrmPayrollRunRepository, typeOrmPayrollItemRepository: TypeOrmPayrollItemRepository);
    /**
     * Open a new payroll run in `DRAFT`.
     *
     * @param input the pay period, pay date, frequency and currency
     * @returns the created run
     */
    createRun(input: IPayrollRunCreateInput): Promise<IPayrollRun>;
    /**
     * List payroll runs of an organization, newest period first.
     *
     * @param filter status, frequency, period range and pagination
     * @returns the matching runs and the total row count
     */
    findAllRuns(filter: IPayrollRunFindInput): Promise<IPagination<IPayrollRun>>;
    /**
     * Read one run with its items.
     *
     * @param id the run to read
     * @param organizationId the organization the run belongs to
     * @returns the run
     */
    findOneRun(id: ID, organizationId: ID): Promise<PayrollRun>;
    /**
     * Edit the period, pay date, frequency, currency or notes of a run that has not been paid.
     *
     * @param id the run to update
     * @param organizationId the organization the run belongs to
     * @param input the fields to change
     * @returns the updated run
     */
    updateRun(id: ID, organizationId: ID, input: IPayrollRunUpdateInput): Promise<IPayrollRun>;
    /**
     * Move a run from `DRAFT` to `PENDING_APPROVAL`.
     *
     * @param id the run to submit
     * @param organizationId the organization the run belongs to
     * @returns the submitted run
     */
    submitForApproval(id: ID, organizationId: ID): Promise<IPayrollRun>;
    /**
     * Move a run from `PENDING_APPROVAL` to `APPROVED`.
     *
     * @param id the run to approve
     * @param organizationId the organization the run belongs to
     * @returns the approved run
     */
    approve(id: ID, organizationId: ID): Promise<IPayrollRun>;
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
    process(id: ID, organizationId: ID): Promise<IPayrollRun>;
    /**
     * Cancel a run that has not been paid. Cancelling an already cancelled run is a no-op.
     *
     * @param id the run to cancel
     * @param organizationId the organization the run belongs to
     * @returns the cancelled run
     */
    cancel(id: ID, organizationId: ID): Promise<IPayrollRun>;
    /**
     * Add an earning or deduction line to a run that has not been paid.
     *
     * @param payrollRunId the run to add the line to
     * @param input the line to add
     * @returns the created line
     */
    addItem(payrollRunId: ID, input: IPayrollItemCreateInput): Promise<IPayrollItem>;
    /**
     * Remove a line from a run that has not been paid.
     *
     * @param payrollRunId the run the line belongs to
     * @param itemId the line to remove
     * @param organizationId the organization the run belongs to
     * @returns the delete result
     */
    removeItem(payrollRunId: ID, itemId: ID, organizationId: ID): Promise<DeleteResult>;
    /**
     * Break a run down into what each employee earns, is deducted and takes home.
     *
     * @param id the run to summarize
     * @param organizationId the organization the run belongs to
     * @returns one summary per employee
     */
    getSummaryByRun(id: ID, organizationId: ID): Promise<IPayrollSummary[]>;
    /**
     * Totals across every paid run of an organization, grouped by currency.
     *
     * Runs are grouped rather than summed together because adding amounts denominated in
     * different currencies produces a number that means nothing.
     *
     * @param organizationId the organization to report on
     * @returns one set of totals per currency
     */
    getStatistics(organizationId: ID): Promise<IPayrollStatistics[]>;
    /**
     * Move a run from one of `from` to `to`, or refuse.
     */
    private transition;
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
    private recalculateTotals;
}
