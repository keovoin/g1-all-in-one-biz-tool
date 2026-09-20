"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const core_2 = require("../../core");
const crud_service_1 = require("../../core/crud/crud.service");
const token_entity_1 = require("../entities/token.entity");
const interfaces_1 = require("../interfaces");
const micro_orm_1 = require("./micro-orm");
const orm_adapter_repository_1 = require("./orm-adapter.repository");
const type_orm_1 = require("./type-orm");
// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------
let TokenRepository = class TokenRepository extends crud_service_1.CrudService {
    constructor(typeOrmTokenRepository, mikroOrmTokenRepository) {
        super(typeOrmTokenRepository, mikroOrmTokenRepository);
        this.typeOrmTokenRepository = typeOrmTokenRepository;
        this.mikroOrmTokenRepository = mikroOrmTokenRepository;
    }
    // -- Read -----------------------------------------------------------------
    async findByHashWithLock(tokenHash) {
        if (this.ormType === core_2.MultiORMEnum.TypeORM) {
            return this.typeOrmTokenRepository
                .createQueryBuilder('token')
                .where('token.tokenHash = :tokenHash', { tokenHash })
                .setLock('pessimistic_write')
                .getOne();
        }
        const token = await this.mikroOrmTokenRepository.findOne({ tokenHash });
        if (token) {
            const em = this.mikroOrmTokenRepository.getEntityManager();
            await em.lock(token, core_1.LockMode.PESSIMISTIC_WRITE);
            await em.refresh(token);
        }
        return token;
    }
    async findByHash(tokenHash) {
        return this.findOneByWhereOptions({ tokenHash });
    }
    async findById(id) {
        return this.findOneByWhereOptions({ id });
    }
    async findActiveByUserAndType(userId, tokenType) {
        return this.find({
            where: { userId, tokenType, status: interfaces_1.TokenStatus.ACTIVE },
            order: { createdAt: 'DESC' }
        });
    }
    // -- Write ----------------------------------------------------------------
    async create(tokenData) {
        const token = await super.create(tokenData);
        return this.save(token);
    }
    async save(token) {
        return super.save(token);
    }
    async updateStatus(tokenId, status, version, additionalData) {
        const updateData = { status, ...additionalData };
        if (status === interfaces_1.TokenStatus.REVOKED)
            updateData.revokedAt = new Date();
        const result = await this.update({ id: tokenId, version }, updateData);
        return result?.['id'] || result?.['affected'] === 1;
    }
    async updateLastUsed(tokenId) {
        if (this.ormType === core_2.MultiORMEnum.MikroORM) {
            const em = this.mikroOrmTokenRepository.getEntityManager();
            const tokenMeta = em.getMetadata(token_entity_1.Token);
            const usageCountColumn = tokenMeta.properties.usageCount?.fieldNames?.[0] ?? 'usageCount';
            await this.mikroOrmTokenRepository.nativeUpdate({ id: tokenId }, {
                lastUsedAt: new Date(),
                usageCount: (0, core_1.raw)('?? + 1', [usageCountColumn])
            });
            return;
        }
        const usageCountColumn = this.typeOrmTokenRepository.metadata.findColumnWithPropertyName('usageCount');
        const escapedUsageCountColumn = this.typeOrmTokenRepository.manager.connection.driver.escape(usageCountColumn?.databaseName ?? 'usageCount');
        await this.typeOrmTokenRepository
            .createQueryBuilder()
            .update(token_entity_1.Token)
            .set({
            lastUsedAt: new Date(),
            usageCount: () => `${escapedUsageCountColumn} + 1`
        })
            .where('id = :tokenId', { tokenId })
            .execute();
    }
    async revokeAllByUserAndType(userId, tokenType, revokedById, reason) {
        const result = await this.update({ userId, tokenType, status: interfaces_1.TokenStatus.ACTIVE }, { status: interfaces_1.TokenStatus.REVOKED, revokedAt: new Date(), revokedById, revokedReason: reason });
        return result?.['id'] || result?.['affected'] || 0;
    }
    async revokeInactiveTokens(tokenType, inactivityThresholdMs) {
        const thresholdDate = new Date(Date.now() - inactivityThresholdMs);
        const result = await this.update({ tokenType, status: interfaces_1.TokenStatus.ACTIVE, lastUsedAt: (0, typeorm_1.LessThan)(thresholdDate) }, { status: interfaces_1.TokenStatus.REVOKED, revokedAt: new Date(), revokedReason: 'Inactivity timeout' });
        return result?.['id'] || result?.['affected'] || 0;
    }
    async markExpiredTokens() {
        const result = await this.update({ status: interfaces_1.TokenStatus.ACTIVE, expiresAt: (0, typeorm_1.LessThan)(new Date()) }, { status: interfaces_1.TokenStatus.EXPIRED });
        return result?.['id'] || result?.['affected'] || 0;
    }
    // -- Query ----------------------------------------------------------------
    async query(filters, limit = 100, offset = 0) {
        const where = {};
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.tokenType)
            where.tokenType = filters.tokenType;
        if (filters.status)
            where.status = filters.status;
        if (filters.createdAfter && filters.createdBefore) {
            where.createdAt = (0, typeorm_1.Between)(filters.createdAfter, filters.createdBefore);
        }
        else if (filters.createdAfter) {
            where.createdAt = (0, typeorm_1.MoreThan)(filters.createdAfter);
        }
        else if (filters.createdBefore) {
            where.createdAt = (0, typeorm_1.LessThan)(filters.createdBefore);
        }
        return this.paginate({ where, take: limit, skip: offset, order: { createdAt: 'DESC' } });
    }
    async deleteOlderThan(date, status) {
        const where = { createdAt: (0, typeorm_1.LessThan)(date) };
        if (status?.length)
            where.status = (0, typeorm_1.In)(status);
        const result = await this.delete(where);
        return result?.['id'] || result?.['affected'] || 0;
    }
    // -- Transaction ----------------------------------------------------------
    async transaction(work) {
        if (this.ormType === core_2.MultiORMEnum.TypeORM) {
            return this.typeOrmTokenRepository.manager.transaction(async (em) => {
                return work((0, orm_adapter_repository_1.buildTypeOrmAdapter)(em.getRepository(token_entity_1.Token)));
            });
        }
        return this.mikroOrmTokenRepository.getEntityManager().transactional(async (em) => {
            return work((0, orm_adapter_repository_1.buildMikroOrmAdapter)(em.getRepository(token_entity_1.Token)));
        });
    }
};
exports.TokenRepository = TokenRepository;
exports.TokenRepository = TokenRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_1.TypeOrmTokenRepository,
        micro_orm_1.MikroOrmTokenRepository])
], TokenRepository);
//# sourceMappingURL=token.repository.js.map