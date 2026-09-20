"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffBalanceService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("./../core/context");
const crud_1 = require("./../core/crud");
const internal_1 = require("./../core/entities/internal");
const database_helper_1 = require("./../database/database.helper");
const assert_organization_membership_1 = require("./../user-organization/assert-organization-membership");
const time_off_balance_entity_1 = require("./time-off-balance.entity");
const mikro_orm_time_off_balance_repository_1 = require("./repository/mikro-orm-time-off-balance.repository");
const type_orm_time_off_balance_repository_1 = require("./repository/type-orm-time-off-balance.repository");
/**
 * Leave balances per employee, per policy, per year (issue #314).
 *
 * `deduct` and `reverse` are written as single conditional UPDATE statements rather than
 * read-modify-write pairs. Two approvals landing at the same moment on a read-modify-write would
 * each read the same `taken`, and one of the two deductions would silently vanish — an employee
 * could take more leave than they have. The UPDATE carries its own balance check in the WHERE
 * clause, so the database decides, and a zero row count means "not enough left".
 */
let TimeOffBalanceService = class TimeOffBalanceService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTimeOffBalanceRepository, mikroOrmTimeOffBalanceRepository) {
        super(typeOrmTimeOffBalanceRepository, mikroOrmTimeOffBalanceRepository);
        this.typeOrmTimeOffBalanceRepository = typeOrmTimeOffBalanceRepository;
        this.mikroOrmTimeOffBalanceRepository = mikroOrmTimeOffBalanceRepository;
    }
    /**
     * List balances, optionally narrowed by employee, policy and year.
     *
     * A caller without `CHANGE_SELECTED_EMPLOYEE` only ever sees their own balances, whatever
     * `employeeId` they ask for — leave entitlement is personal data, and every employee holds
     * `TIME_OFF_VIEW` by default.
     *
     * @param input the filters to apply
     * @returns the matching balances
     */
    async findAllByFilter(input) {
        const { policyId, year, organizationId, page, limit } = input;
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        const employeeId = this.resolveVisibleEmployeeId(input.employeeId);
        // Raw repository read: nothing injects the organization, and an undefined key is DROPPED from
        // a TypeORM where object instead of matching nothing, so a missing organization would widen
        // the listing to every organization of the tenant. `sentTo` on the query DTO suppresses the
        // conditional `organizationId` presence AND membership validation, so the DTO cannot be relied
        // on for either. Fail closed.
        await (0, assert_organization_membership_1.assertCurrentUserBelongsToOrganization)(this.typeOrmRepository.manager, organizationId);
        const where = { tenantId, organizationId };
        if (employeeId) {
            where['employeeId'] = employeeId;
        }
        if (policyId) {
            where['policyId'] = policyId;
        }
        if (year) {
            where['year'] = year;
        }
        const take = Math.min(limit ?? 50, 200);
        const skip = Math.max(0, (page ?? 1) - 1) * take;
        const [items, total] = await this.typeOrmRepository.findAndCount({
            where: where,
            relations: { policy: true },
            order: { year: 'DESC' },
            skip,
            take
        });
        return { items, total };
    }
    /**
     * The current employee's own balances. Backs `GET /time-off-balance/me`, which the MCP
     * server's `get_my_time_off_balance` tool already calls.
     *
     * @param input the policy and year to filter by
     * @returns the caller's balances
     */
    async findMine(input) {
        const employeeId = context_1.RequestContext.currentEmployeeId();
        if (!employeeId) {
            throw new common_1.ForbiddenException('Only an employee has a leave balance');
        }
        return this.findAllByFilter({ ...input, employeeId });
    }
    /**
     * Set the accrued days of one employee/policy/year balance, creating the row if it is the
     * first allocation, and recompute `remaining`.
     *
     * This replaces `accrued` rather than adding to it, so re-running an allocation for a period
     * is idempotent instead of compounding.
     *
     * @param input employee, policy, year and the accrued days
     * @returns the updated balance
     */
    async allocate(input) {
        const { employeeId, policyId, year, accrued, organizationId } = input;
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        // Same `sentTo` bypass as the listing: the body DTO may not have checked the organization at all.
        await (0, assert_organization_membership_1.assertCurrentUserBelongsToOrganization)(this.typeOrmRepository.manager, organizationId);
        await this.assertEmployeeAndPolicyExist(employeeId, policyId, tenantId, organizationId);
        const balance = await this.findOrCreate({ employeeId, policyId, year, tenantId, organizationId });
        balance.accrued = accrued;
        balance.remaining = this.computeRemaining({ ...balance, accrued });
        return this.typeOrmRepository.save(balance);
    }
    /**
     * Take days off the balance when a time off request is approved.
     *
     * @param input employee, policy, year and how many days to deduct
     * @returns the balance after the deduction
     */
    async deduct(input) {
        const { employeeId, policyId, year, days, organizationId } = input;
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        // Same `sentTo` bypass as the listing: the body DTO may not have checked the organization at all.
        await (0, assert_organization_membership_1.assertCurrentUserBelongsToOrganization)(this.typeOrmRepository.manager, organizationId);
        const updated = await this.applyDelta(employeeId, policyId, year, days, organizationId, tenantId, true);
        if (updated === 0) {
            // Either the balance does not exist, or it does not have enough days left. `getOrFail`
            // separates the two so the caller gets the accurate error.
            await this.getOrFail(employeeId, policyId, year, organizationId, tenantId);
            throw new common_1.BadRequestException('Insufficient leave balance for the requested number of days');
        }
        return this.getOrFail(employeeId, policyId, year, organizationId, tenantId);
    }
    /**
     * Give days back when an approved request is cancelled or denied after the fact.
     *
     * @param input employee, policy, year and how many days to restore
     * @returns the balance after the reversal
     */
    async reverse(input) {
        const { employeeId, policyId, year, days, organizationId } = input;
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        // Same `sentTo` bypass as the listing: the body DTO may not have checked the organization at all.
        await (0, assert_organization_membership_1.assertCurrentUserBelongsToOrganization)(this.typeOrmRepository.manager, organizationId);
        await this.applyDelta(employeeId, policyId, year, days, organizationId, tenantId, false);
        return this.getOrFail(employeeId, policyId, year, organizationId, tenantId);
    }
    /**
     * Roll each employee's unused days of one policy from one year into the next.
     *
     * The days are moved, not copied: the source year records them in `carriedOut` and stops
     * counting them as remaining, so the same day is never available in two years at once.
     * Re-running it is safe — both sides are *set* to the computed value rather than added to.
     *
     * @param input policy, source year, target year and an optional cap
     * @returns how many employee balances were rolled over
     */
    async carryForward(input) {
        const { policyId, fromYear, toYear, organizationId } = input;
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        // Same `sentTo` bypass as the listing: the body DTO may not have checked the organization at all.
        await (0, assert_organization_membership_1.assertCurrentUserBelongsToOrganization)(this.typeOrmRepository.manager, organizationId);
        if (toYear <= fromYear) {
            throw new common_1.BadRequestException('`toYear` must be later than `fromYear`');
        }
        const policy = await this.typeOrmRepository.manager.findOne(internal_1.TimeOffPolicy, {
            where: { id: policyId, tenantId, organizationId }
        });
        if (!policy) {
            throw new common_1.NotFoundException(`Time off policy with id '${policyId}' was not found in this organization`);
        }
        if (policy.allowCarryForward === false) {
            throw new common_1.BadRequestException('This policy does not allow unused days to be carried forward');
        }
        // An explicit cap in the request wins; otherwise the policy's own cap applies. `0` and
        // unset both mean "no cap".
        const cap = input.maxCarryForwardDays ?? policy.maxCarryForwardDays ?? 0;
        const sources = await this.typeOrmRepository.find({
            where: { policyId, year: fromYear, tenantId, organizationId }
        });
        let carried = 0;
        await this.typeOrmRepository.manager.transaction(async (manager) => {
            for (const source of sources) {
                // Add back what a previous run already moved, so a re-run recomputes rather than
                // shrinking the balance a second time.
                const available = Math.max(0, Number(source.remaining ?? 0) + Number(source.carriedOut ?? 0));
                const days = cap > 0 ? Math.min(available, cap) : available;
                const destination = await this.findOrCreate({ employeeId: source.employeeId, policyId, year: toYear, tenantId, organizationId }, manager);
                destination.carriedForward = days;
                destination.remaining = this.computeRemaining({ ...destination, carriedForward: days });
                await manager.save(time_off_balance_entity_1.TimeOffBalance, destination);
                source.carriedOut = days;
                source.remaining = this.computeRemaining({ ...source, carriedOut: days });
                await manager.save(time_off_balance_entity_1.TimeOffBalance, source);
                carried++;
            }
        });
        return { carried };
    }
    /**
     * `accrued + carriedForward - taken - carriedOut`, never below zero.
     */
    computeRemaining(balance) {
        const remaining = Number(balance.accrued ?? 0) +
            Number(balance.carriedForward ?? 0) -
            Number(balance.taken ?? 0) -
            Number(balance.carriedOut ?? 0);
        return Math.max(0, Math.round(remaining * 100) / 100);
    }
    /**
     * The employee whose balances the caller is allowed to see.
     *
     * Holders of `CHANGE_SELECTED_EMPLOYEE` may look at anybody (or at everybody, by passing no
     * `employeeId`); everybody else is pinned to their own record.
     */
    resolveVisibleEmployeeId(requested) {
        if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE, false)) {
            return requested;
        }
        const employeeId = context_1.RequestContext.currentEmployeeId();
        if (!employeeId) {
            throw new common_1.ForbiddenException('You are not allowed to view leave balances of other employees');
        }
        return employeeId;
    }
    /**
     * Fetch a balance row, or create a zeroed one if this is the first time it is needed.
     *
     * The insert can lose a race against a concurrent caller; the unique index on
     * `(tenantId, organizationId, employeeId, policyId, year)` turns that into an error rather
     * than a duplicate row, and the loser simply re-reads the winner's row.
     *
     * @param key employee, policy, year, tenant and organization
     * @param manager an optional transactional entity manager
     * @returns the existing or newly created balance
     */
    async findOrCreate(key, manager) {
        const repository = manager ? manager.getRepository(time_off_balance_entity_1.TimeOffBalance) : this.typeOrmRepository;
        const existing = await repository.findOne({ where: key });
        if (existing) {
            return existing;
        }
        try {
            return await repository.save(repository.create({ ...key, accrued: 0, taken: 0, carriedForward: 0, carriedOut: 0, remaining: 0 }));
        }
        catch (error) {
            const raced = await repository.findOne({ where: key });
            if (!raced) {
                throw error;
            }
            return raced;
        }
    }
    /**
     * Apply a signed change to `taken` in one statement, so concurrent approvals cannot lose an
     * update. When `spending` is true the statement only matches if enough days are left.
     *
     * @returns the number of rows the statement changed (0 or 1)
     */
    async applyDelta(employeeId, policyId, year, days, organizationId, tenantId, spending) {
        if (!(days > 0)) {
            // A negative or zero delta would invert the arithmetic and hand out leave for free.
            throw new common_1.BadRequestException('The number of days must be greater than zero');
        }
        // A reversal clamps at zero so a double cancellation can never push `taken` negative.
        const takenExpression = spending
            ? (0, database_helper_1.prepareSQLQuery)(`"taken" + :days`)
            : (0, database_helper_1.prepareSQLQuery)(`CASE WHEN "taken" - :days < 0 THEN 0 ELSE "taken" - :days END`);
        // Explicit, parameterised conditions rather than an object literal: an UPDATE builder's
        // object form is easy to get subtly wrong, and this leaves no doubt about what is scoped.
        const builder = this.typeOrmRepository
            .createQueryBuilder()
            .update(time_off_balance_entity_1.TimeOffBalance)
            .set({
            taken: () => takenExpression,
            remaining: () => (0, database_helper_1.prepareSQLQuery)(`"accrued" + "carriedForward" - (${takenExpression}) - "carriedOut"`)
        })
            .where((0, database_helper_1.prepareSQLQuery)(`"employeeId" = :employeeId AND "policyId" = :policyId AND "year" = :year AND "tenantId" = :tenantId AND "organizationId" = :organizationId AND "deletedAt" IS NULL`), { employeeId, policyId, year, tenantId, organizationId })
            .setParameter('days', days);
        if (spending) {
            builder.andWhere((0, database_helper_1.prepareSQLQuery)(`"accrued" + "carriedForward" - "taken" - "carriedOut" >= :days`));
        }
        const result = await builder.execute();
        return result.affected ?? 0;
    }
    /**
     * Read one balance or fail if it does not exist.
     */
    async getOrFail(employeeId, policyId, year, organizationId, tenantId) {
        const balance = await this.typeOrmRepository.findOne({
            where: { employeeId, policyId, year, tenantId, organizationId }
        });
        if (!balance) {
            throw new common_1.NotFoundException('No leave balance exists for this employee, policy and year — allocate one first');
        }
        return balance;
    }
    /**
     * Refuse to touch an employee or a policy from another tenant or organization.
     */
    async assertEmployeeAndPolicyExist(employeeId, policyId, tenantId, organizationId) {
        const manager = this.typeOrmRepository.manager;
        const [employees, policies] = await Promise.all([
            manager.count(internal_1.Employee, { where: { id: employeeId, tenantId, organizationId } }),
            manager.count(internal_1.TimeOffPolicy, { where: { id: policyId, tenantId, organizationId } })
        ]);
        if (employees === 0) {
            throw new common_1.NotFoundException(`Employee with id '${employeeId}' was not found in this organization`);
        }
        if (policies === 0) {
            throw new common_1.NotFoundException(`Time off policy with id '${policyId}' was not found in this organization`);
        }
    }
};
exports.TimeOffBalanceService = TimeOffBalanceService;
exports.TimeOffBalanceService = TimeOffBalanceService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_off_balance_repository_1.TypeOrmTimeOffBalanceRepository,
        mikro_orm_time_off_balance_repository_1.MikroOrmTimeOffBalanceRepository])
], TimeOffBalanceService);
//# sourceMappingURL=time-off-balance.service.js.map