"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailHistoryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("../core/crud");
const context_1 = require("../core/context");
const utils_1 = require("../core/utils");
const type_orm_email_history_repository_1 = require("./repository/type-orm-email-history.repository");
const mikro_orm_email_history_repository_1 = require("./repository/mikro-orm-email-history.repository");
let EmailHistoryService = class EmailHistoryService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmEmailHistoryRepository, mikroOrmEmailHistoryRepository) {
        super(typeOrmEmailHistoryRepository, mikroOrmEmailHistoryRepository);
    }
    /**
     * Retrieves a list of email history records with optional filtering.
     * @param filter Optional filtering options.
     * @returns A paginated list of email history records.
     */
    async findAll(filter) {
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM:
                const { organizationId: mOrgId } = filter.where;
                const mTenantId = context_1.RequestContext.currentTenantId() || filter.where.tenantId;
                const [mItems, mTotal] = await this.mikroOrmRepository.findAndCount({
                    organizationId: mOrgId,
                    tenantId: mTenantId,
                    isActive: true,
                    isArchived: false
                }, {
                    populate: ['user', 'emailTemplate'],
                    limit: filter.take ? filter.take : 20,
                    orderBy: { createdAt: 'DESC' }
                });
                return {
                    items: mItems.map((item) => this.serialize(item)),
                    total: mTotal
                };
            case utils_1.MultiORMEnum.TypeORM:
                const query = this.typeOrmRepository.createQueryBuilder('email_sent');
                query.leftJoin(`${query.alias}.user`, 'user');
                query.leftJoin(`${query.alias}.emailTemplate`, 'emailTemplate');
                query.addSelect(['user.email', 'user.firstName', 'user.lastName', 'user.imageUrl']);
                const { organizationId } = filter.where;
                const tenantId = context_1.RequestContext.currentTenantId() || filter.where.tenantId;
                query.where({
                    organizationId,
                    tenantId,
                    isActive: true,
                    isArchived: false
                });
                query.take(filter.take ? filter.take : 20);
                query.orderBy(`${query.alias}.createdAt`, 'DESC');
                const [items, total] = await query.getManyAndCount();
                return {
                    items,
                    total
                };
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
};
exports.EmailHistoryService = EmailHistoryService;
exports.EmailHistoryService = EmailHistoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_email_history_repository_1.TypeOrmEmailHistoryRepository,
        mikro_orm_email_history_repository_1.MikroOrmEmailHistoryRepository])
], EmailHistoryService);
//# sourceMappingURL=email-history.service.js.map