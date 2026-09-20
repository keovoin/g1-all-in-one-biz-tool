import { Logger } from '@nestjs/common';
import { Repository as TypeOrmBaseEntityRepository, SelectQueryBuilder } from 'typeorm';
import { Knex as KnexConnection } from 'knex';
import { IIssueTypeFindInput, IPagination, ITaskPriorityFindInput, ITaskSizeFindInput, ITaskStatusFindInput, ITaskVersionFindInput } from '@gauzy/contracts';
import { MikroOrmBaseEntityRepository } from '../core/repository/mikro-orm-base-entity.repository';
import { TenantAwareCrudService } from '../core/crud';
import { TenantBaseEntity } from '../core/entities/internal';
/**
 * Union type for all task metadata find input interfaces.
 */
export type TaskMetadataFindInput = ITaskStatusFindInput | ITaskPriorityFindInput | ITaskSizeFindInput | IIssueTypeFindInput | ITaskVersionFindInput;
/**
 * Abstract base service for task metadata entities (statuses, priorities, sizes, issue types, versions, etc.).
 *
 * Provides common CRUD operations with hierarchical fallback logic:
 * tenant → organization → project → team, falling back to system defaults when no match is found.
 */
export declare class TaskMetadataService<BaseEntity extends TenantBaseEntity> extends TenantAwareCrudService<BaseEntity> {
    readonly typeOrmBaseEntityRepository: TypeOrmBaseEntityRepository<BaseEntity>;
    readonly mikroOrmBaseEntityRepository: MikroOrmBaseEntityRepository<BaseEntity>;
    readonly knexConnection: KnexConnection;
    /** Scope columns for hierarchical filtering (tenant → org → project → team). */
    protected static readonly SCOPE_COLUMNS: readonly ["tenantId", "organizationId", "projectId", "organizationTeamId"];
    protected readonly logger: Logger;
    constructor(typeOrmBaseEntityRepository: TypeOrmBaseEntityRepository<BaseEntity>, mikroOrmBaseEntityRepository: MikroOrmBaseEntityRepository<BaseEntity>, knexConnection: KnexConnection);
    /**
     * Fetches entities using Knex.js, falling back to system defaults if none match.
     *
     * @param input - Filter parameters.
     * @returns Paginated result of matching entities.
     */
    fetchAllByKnex(input: TaskMetadataFindInput): Promise<IPagination<BaseEntity>>;
    /**
     * Retrieves entities using TypeORM/MikroORM, falling back to system defaults if none match.
     *
     * @param params - Filter parameters.
     * @returns Paginated result of matching entities.
     */
    fetchAll(params: TaskMetadataFindInput): Promise<IPagination<BaseEntity>>;
    /**
     * Retrieves system default entities (tenantId=null, organizationId=null, isSystem=true).
     *
     * Bypasses TenantAwareCrudService scoping by querying the repository directly,
     * since system defaults have tenantId IS NULL and would otherwise be overwritten
     * by the automatic tenant filter.
     *
     * @returns Paginated result of default system entities.
     */
    getDefaultEntities(): Promise<IPagination<BaseEntity>>;
    /**
     * Resolves hierarchical scoping fields from request parameters.
     * TenantId prefers the current session tenant over the request value.
     *
     * @param request - Filter parameters.
     * @returns Array of [column, resolvedValue] tuples for the scope columns.
     */
    protected getScopeFilters(request: TaskMetadataFindInput): [string, string | null][];
    /**
     * Builds a TypeORM filter query with hierarchical scoping (tenant → org → project → team).
     *
     * @param query - SelectQueryBuilder instance.
     * @param request - Filter parameters.
     * @returns The modified query builder.
     */
    getFilterQuery(query: SelectQueryBuilder<BaseEntity>, request: TaskMetadataFindInput): SelectQueryBuilder<BaseEntity>;
    /**
     * Creates a Knex query builder for the current entity table.
     *
     * @param knex - Knex connection instance.
     * @returns A Knex query builder.
     */
    createKnexQueryBuilder(knex: KnexConnection): KnexConnection.QueryBuilder<any, {
        _base: any;
        _hasSelection: false;
        _keys: never;
        _aliases: {};
        _single: false;
        _intersectProps: {};
        _unionProps: never;
    }[]>;
    /**
     * Retrieves the first matching entity using Knex, or undefined if none found.
     *
     * @param request - Filter parameters.
     * @returns The first matching entity or undefined.
     */
    getOneOrFailByKnex(request: TaskMetadataFindInput): Promise<BaseEntity | undefined>;
    /**
     * Retrieves all matching entities using Knex.
     *
     * @param request - Filter parameters.
     * @returns Array of matching entities.
     */
    getManyAndCountByKnex(request: TaskMetadataFindInput): Promise<KnexConnection.QueryBuilder<any, any>>;
    /**
     * Retrieves system default entities using Knex.
     *
     * @returns Paginated result of default system entities.
     */
    getDefaultEntitiesByKnex(): Promise<IPagination<BaseEntity>>;
    /**
     * Builds a Knex filter query with hierarchical scoping (tenant → org → project → team).
     *
     * @param qb - Knex query builder.
     * @param request - Filter parameters.
     */
    getFilterQueryByKnex(qb: KnexConnection.QueryBuilder<any, any>, request: TaskMetadataFindInput): void;
}
