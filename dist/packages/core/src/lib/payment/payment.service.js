"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const underscore_1 = require("underscore");
const moment = require("moment");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("./../core/crud");
const context_1 = require("../core/context");
const util_1 = require("../core/util");
const utils_2 = require("../core/utils");
const email_service_1 = require("./../email-send/email.service");
const database_helper_1 = require("./../database/database.helper");
const mikro_orm_payment_repository_1 = require("./repository/mikro-orm-payment.repository");
const type_orm_payment_repository_1 = require("./repository/type-orm-payment.repository");
let PaymentService = class PaymentService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmPaymentRepository, mikroOrmPaymentRepository, emailService) {
        super(typeOrmPaymentRepository, mikroOrmPaymentRepository);
        this.typeOrmPaymentRepository = typeOrmPaymentRepository;
        this.mikroOrmPaymentRepository = mikroOrmPaymentRepository;
        this.emailService = emailService;
    }
    /**
     * Retrieves the count and total amount of payments where `isProcessed` is true.
     *
     * @returns {Promise<PaymentStats>} An object containing the count of payments and the total amount.
     */
    async getPaymentStats() {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmRepository.getEntityManager().getKnex();
                const result = await knex('payment').count('id as count').sum('amount as amount').first();
                return {
                    count: parseInt(result?.count ?? '0', 10),
                    amount: parseFloat(result?.amount ?? '0') || 0
                };
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const result = await this.typeOrmPaymentRepository
                    .createQueryBuilder('payment')
                    .select('COUNT(payment.id)', 'count')
                    .addSelect('SUM(payment.amount)', 'amount')
                    .getRawOne();
                return {
                    count: parseInt(result.count, 10),
                    amount: parseFloat(result.amount) || 0
                };
            }
        }
    }
    /**
     * Retrieves payments based on the provided request parameters.
     *
     * @param request - Request parameters for filtering payments.
     * @returns A Promise that resolves to an array of payments.
     */
    async getPayments(request) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const tenantId = context_1.RequestContext.currentTenantId();
                const { organizationId, startDate, endDate } = request;
                let { projectIds = [], contactIds = [] } = request;
                const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
                const where = {
                    tenantId,
                    organizationId,
                    paymentDate: { $gte: start, $lte: end }
                };
                if ((0, utils_1.isNotEmpty)(projectIds))
                    where.projectId = { $in: projectIds };
                if ((0, utils_1.isNotEmpty)(contactIds))
                    where.organizationContactId = { $in: contactIds };
                const items = await this.mikroOrmRepository.find(where, {
                    populate: ['project', 'organizationContact'],
                    orderBy: { paymentDate: 'ASC' },
                    ...(request && request.limit > 0
                        ? { limit: request.limit, offset: (request.page || 0) * request.limit }
                        : {})
                });
                return items.map((e) => this.serialize(e));
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the Payment entity
                const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                // Set up the find options for the query.
                // typeorm-v1: the legacy `join` find-option was removed. The `project` relation is
                // already left-joined and selected below via `relations` + nested `select`, so the
                // explicit `leftJoin` is redundant (the where/order filters use the `payment` columns
                // directly, not the joined `project` alias).
                query.setFindOptions({
                    ...(request && request.limit > 0
                        ? {
                            take: request.limit,
                            skip: (request.page || 0) * request.limit
                        }
                        : {}),
                    select: {
                        project: {
                            id: true,
                            name: true,
                            imageUrl: true,
                            membersCount: true
                        },
                        organizationContact: {
                            id: true,
                            name: true,
                            imageUrl: true
                        }
                    },
                    relations: {
                        project: true,
                        organizationContact: true
                    },
                    order: {
                        paymentDate: 'ASC'
                    }
                });
                // Set up the where clause using the provided filter function
                query.where((qb) => {
                    this.getFilterQuery(qb, request);
                });
                // Set up the where clause using the provided filter function
                return await query.getMany();
            }
        }
    }
    /**
     * Retrieves daily payment report charts based on the provided request parameters.
     *
     * @param request - Request parameters for filtering data.
     * @returns A Promise that resolves to an array of daily payment report charts.
     */
    async getDailyReportCharts(request) {
        let payments;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const tenantId = context_1.RequestContext.currentTenantId();
                const { organizationId, startDate, endDate } = request;
                let { projectIds = [], contactIds = [] } = request;
                const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
                const where = {
                    tenantId,
                    organizationId,
                    paymentDate: { $gte: start, $lte: end }
                };
                if ((0, utils_1.isNotEmpty)(projectIds))
                    where.projectId = { $in: projectIds };
                if ((0, utils_1.isNotEmpty)(contactIds))
                    where.organizationContactId = { $in: contactIds };
                const items = await this.mikroOrmRepository.find(where, {
                    orderBy: { paymentDate: 'ASC' },
                    ...(request.limit > 0 ? { limit: request.limit, offset: (request.page || 0) * request.limit } : {})
                });
                payments = items.map((e) => this.serialize(e));
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query builder for the Payment entity
                const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                // Set up the find options for the query
                query.setFindOptions({
                    ...(request.limit > 0
                        ? {
                            take: request.limit,
                            skip: (request.page || 0) * request.limit
                        }
                        : {}),
                    order: {
                        // Order results by the 'startedAt' field in ascending order
                        paymentDate: 'ASC'
                    }
                });
                // Set up the where clause using the provided filter function
                query.where((qb) => {
                    this.getFilterQuery(qb, request);
                });
                // Set up the where clause using the provided filter function
                payments = await query.getMany();
                break;
            }
        }
        // Gets an array of days between the given start date, end date and timezone.
        const { startDate, endDate, timeZone } = request;
        const days = (0, utils_2.getDaysBetweenDates)(startDate, endDate, timeZone);
        // Group payments by date and calculate sum
        const byDate = (0, underscore_1.chain)(payments)
            .groupBy((payment) => moment.utc(payment.paymentDate).tz(timeZone).format('YYYY-MM-DD'))
            .mapObject((payments, date) => {
            const sum = payments.reduce((iteratee, payment) => {
                return iteratee + parseFloat(payment.amount);
            }, 0);
            return {
                date,
                value: {
                    payment: sum.toFixed(1)
                }
            };
        })
            .value();
        // Map dates to the required format
        const dates = days.map((date) => byDate[date] || { date, value: { payment: 0 } });
        return dates;
    }
    /**
     *
     * @param query
     * @param request
     * @returns
     */
    getFilterQuery(query, request) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const { organizationId, startDate, endDate } = request;
        let { projectIds = [], contactIds = [] } = request;
        // Calculate start and end dates using a utility function
        const { start, end } = (0, utils_2.getDateRangeFormat)(moment.utc(startDate || moment().startOf('week')), moment.utc(endDate || moment().endOf('week')));
        query.andWhere(new typeorm_1.Brackets((qb) => {
            qb.where({
                paymentDate: (0, typeorm_1.Between)(start, end)
            });
        }));
        query.andWhere(new typeorm_1.Brackets((qb) => {
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
        }));
        query.andWhere(new typeorm_1.Brackets((qb) => {
            if ((0, utils_1.isNotEmpty)(projectIds)) {
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" IN (:...projectIds)`), {
                    projectIds
                });
            }
            if ((0, utils_1.isNotEmpty)(contactIds)) {
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationContactId" IN (:...contactIds)`), {
                    contactIds
                });
            }
        }));
        return query;
    }
    /**
     *
     * @param languageCode
     * @param params
     * @param origin
     */
    async sendReceipt(languageCode, invoice, payment, origin) {
        try {
            const { primaryEmail: recipientEmail, name: recipientName } = invoice.toContact;
            await this.emailService.sendPaymentReceipt(languageCode, recipientEmail, recipientName, invoice.invoiceNumber, payment.amount, payment.currency, invoice.fromOrganization, origin);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Paginates PaymentEntity records using custom filters.
     *
     * @param filter - The pagination parameters including custom filters.
     * @returns A promise resolving to paginated PaymentEntity data.
     */
    pagination(filter) {
        if (filter?.where) {
            const { where } = filter;
            // Apply like filter for the note field.
            if (where.note) {
                filter.where['note'] = (0, typeorm_1.Raw)((alias) => `${alias} ${util_1.LIKE_OPERATOR} :note`, {
                    note: `%${where.note}%`
                });
            }
            // Apply date range filter for paymentDate field
            if (where.paymentDate) {
                const { startDate, endDate } = where.paymentDate;
                const start = startDate ? moment.utc(startDate) : moment().startOf('month').utc();
                const end = endDate ? moment.utc(endDate) : moment().endOf('month').utc();
                filter['where']['paymentDate'] = (0, typeorm_1.Between)(start.format('YYYY-MM-DD HH:mm:ss'), end.format('YYYY-MM-DD HH:mm:ss'));
            }
            // Apply filter for the tags field
            if (where.tags) {
                const { tags } = where;
                filter['where']['tags'] = {
                    id: (0, typeorm_1.In)(tags)
                };
            }
        }
        return super.paginate(filter ?? {});
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_payment_repository_1.TypeOrmPaymentRepository,
        mikro_orm_payment_repository_1.MikroOrmPaymentRepository,
        email_service_1.EmailService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map