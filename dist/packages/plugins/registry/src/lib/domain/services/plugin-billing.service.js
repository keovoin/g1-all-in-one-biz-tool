"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBillingService = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const repositories_1 = require("../repositories");
let PluginBillingService = class PluginBillingService extends core_1.TenantAwareCrudService {
    constructor(typeOrmPluginBillingRepository, mikroOrmPluginBillingRepository) {
        super(typeOrmPluginBillingRepository, mikroOrmPluginBillingRepository);
        this.typeOrmPluginBillingRepository = typeOrmPluginBillingRepository;
        this.mikroOrmPluginBillingRepository = mikroOrmPluginBillingRepository;
    }
    /**
     * Create billing record
     */
    async create(input) {
        return await super.create(input);
    }
    /**
     * Update billing record
     */
    async update(id, input) {
        const existing = await this.findOneByIdString(id);
        if (!existing) {
            throw new Error(`Billing record with ID '${id}' not found`);
        }
        return super.update(id, input);
    }
    /**
     * Find billing records with advanced filtering
     */
    async findBillings(options) {
        switch (this.ormType) {
            case core_1.MultiORMEnum.MikroORM: {
                // MikroORM: Use Knex for advanced filtering with joins
                const knex = this.mikroOrmRepository.getKnex();
                let qb = knex('plugin_billing as billing').leftJoin('plugin_subscription as subscription', 'billing.subscriptionId', 'subscription.id');
                if (options.subscriptionId) {
                    qb = qb.where('billing.subscriptionId', options.subscriptionId);
                }
                if (options.status) {
                    qb = qb.andWhere('billing.status', options.status);
                }
                if (options.billingPeriod) {
                    qb = qb.andWhere('billing.billingPeriod', options.billingPeriod);
                }
                if (options.currency) {
                    qb = qb.andWhere('billing.currency', options.currency);
                }
                if (options.dateRange) {
                    qb = qb.whereBetween('billing.billingDate', [options.dateRange.start, options.dateRange.end]);
                }
                if (options.amountRange) {
                    qb = qb.whereBetween('billing.totalAmount', [options.amountRange.min, options.amountRange.max]);
                }
                return await qb.select('billing.*').orderBy('billing.billingDate', 'desc');
            }
            case core_1.MultiORMEnum.TypeORM:
            default: {
                const queryBuilder = this.typeOrmPluginBillingRepository
                    .createQueryBuilder('billing')
                    .leftJoinAndSelect('billing.subscription', 'subscription');
                // Apply filters
                if (options.subscriptionId) {
                    queryBuilder.andWhere('billing.subscriptionId = :subscriptionId', {
                        subscriptionId: options.subscriptionId
                    });
                }
                if (options.status) {
                    queryBuilder.andWhere('billing.status = :status', { status: options.status });
                }
                if (options.billingPeriod) {
                    queryBuilder.andWhere('billing.billingPeriod = :billingPeriod', {
                        billingPeriod: options.billingPeriod
                    });
                }
                if (options.currency) {
                    queryBuilder.andWhere('billing.currency = :currency', { currency: options.currency });
                }
                if (options.dateRange) {
                    queryBuilder.andWhere('billing.billingDate BETWEEN :startDate AND :endDate', {
                        startDate: options.dateRange.start,
                        endDate: options.dateRange.end
                    });
                }
                if (options.amountRange) {
                    queryBuilder.andWhere('billing.totalAmount BETWEEN :minAmount AND :maxAmount', {
                        minAmount: options.amountRange.min,
                        maxAmount: options.amountRange.max
                    });
                }
                return await queryBuilder.orderBy('billing.billingDate', 'DESC').getMany();
            }
        }
    }
    /**
     * Get billing summary for a subscription
     */
    async getBillingSummary(subscriptionId) {
        const billings = await this.typeOrmPluginBillingRepository.find({
            where: { subscriptionId },
            order: { billingDate: 'DESC' }
        });
        const summary = {
            subscriptionId,
            totalBillings: billings.length,
            totalAmount: 0,
            paidAmount: 0,
            pendingAmount: 0,
            overdueAmount: 0,
            currency: billings[0]?.currency || 'USD'
        };
        billings.forEach((billing) => {
            summary.totalAmount += billing.amount;
            switch (billing.status) {
                case contracts_1.PluginBillingStatus.PAID:
                case contracts_1.PluginBillingStatus.PARTIALLY_PAID:
                    summary.paidAmount += billing.amount;
                    break;
                case contracts_1.PluginBillingStatus.PENDING:
                case contracts_1.PluginBillingStatus.PROCESSED:
                    summary.pendingAmount += billing.amount;
                    break;
                case contracts_1.PluginBillingStatus.OVERDUE:
                    summary.overdueAmount += billing.amount;
                    break;
            }
        });
        // Get latest billing date
        if (billings.length > 0) {
            summary.lastBillingDate = billings[0].billingDate;
        }
        return summary;
    }
    /**
     * Get overdue billings
     */
    async getOverdueBillings() {
        const now = new Date();
        return await this.typeOrmPluginBillingRepository.find({
            where: {
                status: contracts_1.PluginBillingStatus.PENDING,
                dueDate: (0, typeorm_1.LessThan)(now)
            },
            relations: (0, core_1.parseFindOptionsRelations)(['subscription']),
            order: { dueDate: 'ASC' }
        });
    }
    /**
     * Mark billing as paid
     */
    async markAsPaid(id, paymentReference) {
        const updateData = {
            status: contracts_1.PluginBillingStatus.PAID
        };
        // Add payment reference to metadata if provided
        if (paymentReference) {
            const billing = await this.findOneByIdString(id);
            updateData.metadata = {
                ...billing?.metadata,
                paymentReference
            };
        }
        return this.update(id, updateData);
    }
    /**
     * Mark billing as failed
     */
    async markAsFailed(id, reason) {
        const billing = await this.findOneByIdString(id);
        if (!billing) {
            throw new Error(`Billing record with ID '${id}' not found`);
        }
        const updateData = {
            status: contracts_1.PluginBillingStatus.FAILED,
            metadata: reason ? { ...billing.metadata, failureReason: reason } : billing.metadata
        };
        return this.update(id, updateData);
    }
    /**
     * Generate invoice number
     */
    async generateInvoiceNumber() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        // Get count of billings this month to generate sequence number
        const startOfMonth = new Date(year, now.getMonth(), 1);
        const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);
        const monthlyCount = await this.typeOrmPluginBillingRepository.count({
            where: {
                createdAt: (0, typeorm_1.Between)(startOfMonth, endOfMonth)
            }
        });
        const sequence = String(monthlyCount + 1).padStart(4, '0');
        return `INV-${year}${month}-${sequence}`;
    }
};
exports.PluginBillingService = PluginBillingService;
exports.PluginBillingService = PluginBillingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [repositories_1.TypeOrmPluginBillingRepository,
        repositories_1.MikroOrmPluginBillingRepository])
], PluginBillingService);
//# sourceMappingURL=plugin-billing.service.js.map