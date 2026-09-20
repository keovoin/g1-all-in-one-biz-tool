"use strict";
var TaskMetadataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMetadataService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const knex_1 = require("knex");
const utils_1 = require("@gauzy/utils");
const contracts_1 = require("@gauzy/contracts");
const mikro_orm_base_entity_repository_1 = require("../core/repository/mikro-orm-base-entity.repository");
const file_storage_1 = require("../core/file-storage");
const context_1 = require("../core/context");
const crud_1 = require("../core/crud");
const utils_2 = require("../core/utils");
const database_helper_1 = require("./../database/database.helper");
/**
 * Abstract base service for task metadata entities (statuses, priorities, sizes, issue types, versions, etc.).
 *
 * Provides common CRUD operations with hierarchical fallback logic:
 * tenant → organization → project → team, falling back to system defaults when no match is found.
 */
let TaskMetadataService = TaskMetadataService_1 = class TaskMetadataService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmBaseEntityRepository, mikroOrmBaseEntityRepository, knexConnection) {
        super(typeOrmBaseEntityRepository, mikroOrmBaseEntityRepository);
        this.typeOrmBaseEntityRepository = typeOrmBaseEntityRepository;
        this.mikroOrmBaseEntityRepository = mikroOrmBaseEntityRepository;
        this.knexConnection = knexConnection;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    /**
     * Fetches entities using Knex.js, falling back to system defaults if none match.
     *
     * @param input - Filter parameters.
     * @returns Paginated result of matching entities.
     */
    async fetchAllByKnex(input) {
        try {
            const first = await this.getOneOrFailByKnex(input);
            if (!first) {
                return await this.getDefaultEntitiesByKnex();
            }
            const items = await this.getManyAndCountByKnex(input);
            // Resolve full icon URLs for items with an icon
            if (items.length > 0) {
                const store = new file_storage_1.FileStorage().setProvider(contracts_1.FileStorageProviderEnum.LOCAL);
                const provider = store.getProviderInstance();
                await Promise.all(items.map(async (item) => {
                    if (item.icon) {
                        item.fullIconUrl = await provider.url(item.icon);
                    }
                }));
            }
            return { items, total: items.length };
        }
        catch (error) {
            this.logger.error('Failed to retrieve entities by Knex', error);
            return await this.getDefaultEntitiesByKnex();
        }
    }
    /**
     * Retrieves entities using TypeORM/MikroORM, falling back to system defaults if none match.
     *
     * @param params - Filter parameters.
     * @returns Paginated result of matching entities.
     */
    async fetchAll(params) {
        try {
            const { organizationId, projectId, organizationTeamId } = params;
            const tenantId = context_1.RequestContext.currentTenantId() ?? params.tenantId;
            // No tenant context — return system defaults to prevent cross-tenant leak
            if (!tenantId) {
                return await this.getDefaultEntities();
            }
            const options = {
                where: {
                    tenantId,
                    organizationId: (0, utils_1.isNotEmpty)(organizationId) ? organizationId : (0, typeorm_1.IsNull)(),
                    projectId: (0, utils_1.isNotEmpty)(projectId) ? projectId : (0, typeorm_1.IsNull)(),
                    organizationTeamId: (0, utils_1.isNotEmpty)(organizationTeamId) ? organizationTeamId : (0, typeorm_1.IsNull)()
                }
            };
            // Use base class findAll — we supply explicit tenant scoping via the where clause,
            // intentionally bypassing automatic tenant scoping.
            const { items, total } = await super.findAll(options);
            if (total === 0) {
                return await this.getDefaultEntities();
            }
            return { items, total };
        }
        catch (error) {
            this.logger.warn(`No entities found for params ${JSON.stringify(params)} (${this.ormType}): ${error?.message}`);
            return await this.getDefaultEntities();
        }
    }
    /**
     * Retrieves system default entities (tenantId=null, organizationId=null, isSystem=true).
     *
     * Bypasses TenantAwareCrudService scoping by querying the repository directly,
     * since system defaults have tenantId IS NULL and would otherwise be overwritten
     * by the automatic tenant filter.
     *
     * @returns Paginated result of default system entities.
     */
    async getDefaultEntities() {
        try {
            const options = {
                where: {
                    tenantId: (0, typeorm_1.IsNull)(),
                    organizationId: (0, typeorm_1.IsNull)(),
                    projectId: (0, typeorm_1.IsNull)(),
                    organizationTeamId: (0, typeorm_1.IsNull)(),
                    isSystem: true
                }
            };
            let items;
            let total;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const { where, mikroOptions } = (0, utils_2.parseTypeORMFindToMikroOrm)(options);
                    [items, total] = (await this.mikroOrmBaseEntityRepository.findAndCount(where, mikroOptions));
                    items = items.map((entity) => this.serialize(entity));
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                    [items, total] = await this.typeOrmBaseEntityRepository.findAndCount(options);
                    break;
                default:
                    throw new Error(`Not implemented for ${this.ormType}`);
            }
            return { items, total };
        }
        catch (error) {
            this.logger.error(`Error while getting default entities (${this.ormType})`, error);
            return { items: [], total: 0 };
        }
    }
    /**
     * Resolves hierarchical scoping fields from request parameters.
     * TenantId prefers the current session tenant over the request value.
     *
     * @param request - Filter parameters.
     * @returns Array of [column, resolvedValue] tuples for the scope columns.
     */
    getScopeFilters(request) {
        return TaskMetadataService_1.SCOPE_COLUMNS.map((column) => {
            const raw = request[column];
            if (!(0, utils_1.isNotEmpty)(raw))
                return [column, null];
            return [column, column === 'tenantId' ? context_1.RequestContext.currentTenantId() || raw : raw];
        });
    }
    /**
     * Builds a TypeORM filter query with hierarchical scoping (tenant → org → project → team).
     *
     * @param query - SelectQueryBuilder instance.
     * @param request - Filter parameters.
     * @returns The modified query builder.
     */
    getFilterQuery(query, request) {
        for (const [column, value] of this.getScopeFilters(request)) {
            if (value !== null) {
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."${column}" = :${column}`), { [column]: value });
            }
            else {
                query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."${column}" IS NULL`));
            }
        }
        return query;
    }
    /**
     * Creates a Knex query builder for the current entity table.
     *
     * @param knex - Knex connection instance.
     * @returns A Knex query builder.
     */
    createKnexQueryBuilder(knex) {
        return knex(this.tableName);
    }
    /**
     * Retrieves the first matching entity using Knex, or undefined if none found.
     *
     * @param request - Filter parameters.
     * @returns The first matching entity or undefined.
     */
    async getOneOrFailByKnex(request) {
        return await this.createKnexQueryBuilder(this.knexConnection)
            .modify((qb) => {
            this.getFilterQueryByKnex(qb, request);
        })
            .first();
    }
    /**
     * Retrieves all matching entities using Knex.
     *
     * @param request - Filter parameters.
     * @returns Array of matching entities.
     */
    async getManyAndCountByKnex(request) {
        return await this.createKnexQueryBuilder(this.knexConnection).modify((qb) => {
            this.getFilterQueryByKnex(qb, request);
        });
    }
    /**
     * Retrieves system default entities using Knex.
     *
     * @returns Paginated result of default system entities.
     */
    async getDefaultEntitiesByKnex() {
        const items = await this.createKnexQueryBuilder(this.knexConnection).modify((qb) => {
            qb.where('isSystem', true);
            qb.whereNull('tenantId');
            qb.whereNull('organizationId');
            qb.whereNull('projectId');
            qb.whereNull('organizationTeamId');
        });
        return { items, total: items.length };
    }
    /**
     * Builds a Knex filter query with hierarchical scoping (tenant → org → project → team).
     *
     * @param qb - Knex query builder.
     * @param request - Filter parameters.
     */
    getFilterQueryByKnex(qb, request) {
        for (const [column, value] of this.getScopeFilters(request)) {
            if (value !== null) {
                qb.where(column, value);
            }
            else {
                qb.whereNull(column);
            }
        }
    }
};
exports.TaskMetadataService = TaskMetadataService;
/** Scope columns for hierarchical filtering (tenant → org → project → team). */
TaskMetadataService.SCOPE_COLUMNS = [
    'tenantId',
    'organizationId',
    'projectId',
    'organizationTeamId'
];
exports.TaskMetadataService = TaskMetadataService = TaskMetadataService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.Repository,
        mikro_orm_base_entity_repository_1.MikroOrmBaseEntityRepository, Function])
], TaskMetadataService);
//# sourceMappingURL=task-metadata.service.js.map