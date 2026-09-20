import { DeleteResult } from 'typeorm';
import { ID, IPagination, IPayrollItem, IPayrollRun, IPayrollStatistics, IPayrollSummary } from '@gauzy/contracts';
import { CreatePayrollItemDTO, CreatePayrollRunDTO, PayrollRunQueryDTO, UpdatePayrollRunDTO } from './dto';
import { PayrollRunService } from './payroll-run.service';
/**
 * Payroll runs and their line items (issue #2453).
 *
 * Reading needs `ORG_PAYROLL_VIEW`, editing needs `ORG_PAYROLL_EDIT`, and approving or paying a
 * run needs the separate `ORG_PAYROLL_APPROVE` — the person who prepares a payroll run should not
 * be able to approve their own work unaided.
 */
export declare class PayrollRunController {
    private readonly payrollRunService;
    constructor(payrollRunService: PayrollRunService);
    /**
     * Totals across every paid payroll run of an organization, grouped by currency.
     *
     * @param organizationId the organization to report on
     * @returns one set of totals per currency
     */
    getStatistics(organizationId: ID): Promise<IPayrollStatistics[]>;
    /**
     * List payroll runs, newest pay period first.
     *
     * @param options status, frequency, period range and pagination
     * @returns the matching runs
     */
    findAll(options: PayrollRunQueryDTO): Promise<IPagination<IPayrollRun>>;
    /**
     * Read one payroll run with its line items.
     *
     * @param id the run to read
     * @param organizationId the organization the run belongs to
     * @returns the run
     */
    findById(id: ID, organizationId: ID): Promise<IPayrollRun>;
    /**
     * Break a run down into what each employee earns, is deducted and takes home.
     *
     * @param id the run to summarize
     * @param organizationId the organization the run belongs to
     * @returns one summary per employee
     */
    getSummary(id: ID, organizationId: ID): Promise<IPayrollSummary[]>;
    /**
     * Open a new payroll run in `DRAFT`.
     *
     * @param entity the pay period, pay date, frequency and currency
     * @returns the created run
     */
    create(entity: CreatePayrollRunDTO): Promise<IPayrollRun>;
    /**
     * Edit a payroll run that has not been paid.
     *
     * @param id the run to update
     * @param organizationId the organization the run belongs to
     * @param entity the fields to change
     * @returns the updated run
     */
    update(id: ID, organizationId: ID, entity: UpdatePayrollRunDTO): Promise<IPayrollRun>;
    /**
     * Move a draft run to `PENDING_APPROVAL`.
     *
     * @param id the run to submit
     * @param organizationId the organization the run belongs to
     * @returns the submitted run
     */
    submitForApproval(id: ID, organizationId: ID): Promise<IPayrollRun>;
    /**
     * Approve a run that is pending approval.
     *
     * @param id the run to approve
     * @param organizationId the organization the run belongs to
     * @returns the approved run
     */
    approve(id: ID, organizationId: ID): Promise<IPayrollRun>;
    /**
     * Recompute the totals of an approved run and mark it paid.
     *
     * @param id the run to process
     * @param organizationId the organization the run belongs to
     * @returns the processed run
     */
    process(id: ID, organizationId: ID): Promise<IPayrollRun>;
    /**
     * Cancel a run that has not been paid.
     *
     * @param id the run to cancel
     * @param organizationId the organization the run belongs to
     * @returns the cancelled run
     */
    cancel(id: ID, organizationId: ID): Promise<IPayrollRun>;
    /**
     * Add an earning or deduction line to a draft run.
     *
     * @param id the run to add the line to
     * @param entity the line to add
     * @returns the created line
     */
    addItem(id: ID, entity: CreatePayrollItemDTO): Promise<IPayrollItem>;
    /**
     * Remove a line from a draft run.
     *
     * @param id the run the line belongs to
     * @param itemId the line to remove
     * @param organizationId the organization the run belongs to
     * @returns the delete result
     */
    removeItem(id: ID, itemId: ID, organizationId: ID): Promise<DeleteResult>;
}
