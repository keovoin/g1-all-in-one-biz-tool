import { DeleteResult, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ID, IPagination } from '@gauzy/contracts';
import { LegacyFindManyOptions, LegacyFindOneOptions } from '../utils';
import { MikroOrmBaseEntityRepository } from '../../core/repository/mikro-orm-base-entity.repository';
import { TenantBaseEntity } from '../entities/internal';
import { CrudService } from './crud.service';
import { ICrudService, IPartialEntity } from './icrud.service';
import { ITryRequest } from './try-request';
/**
 * This abstract class adds tenantId to all query filters if a user is available in the current RequestContext
 * If a user is not available in RequestContext, then it behaves exactly the same as CrudService
 */
export declare abstract class TenantAwareCrudService<T extends TenantBaseEntity> extends CrudService<T> implements ICrudService<T> {
    private static skipEmployeeFilterSequence;
    /** The sequence keeps the key unique even when two services share a runtime class name. */
    private readonly skipEmployeeFilterKey;
    constructor(typeOrmRepository: Repository<T>, mikroOrmRepository: MikroOrmBaseEntityRepository<T>);
    /**
     * Reads how many bypass blocks are currently open for this service.
     * Uses AsyncLocalStorage via RequestContext to avoid race conditions.
     */
    private getSkipEmployeeFilterDepth;
    /**
     * Stores how many bypass blocks are currently open for this service.
     * Uses AsyncLocalStorage via RequestContext to avoid race conditions.
     */
    private setSkipEmployeeFilterDepth;
    private getSkipEmployeeFilter;
    /**
     * Builds TypeORM find conditions to restrict data
     * to the currently logged-in employee.
     *
     * If the user has permission to change the selected employee
     * or filtering is skipped, no automatic restriction is applied.
     */
    private findConditionsWithEmployeeByUser;
    /**
     * Executes a callback without automatic employeeId filtering.
     * This is useful when you need to implement custom access control logic.
     * Uses AsyncLocalStorage via RequestContext to avoid race conditions between concurrent requests.
     *
     * The bypass applies to this service only, and is reference counted.
     *
     * @param callback - The async function to execute without employee filtering
     * @returns The result of the callback
     *
     * @example
     * ```typescript
     * const dailyPlan = await this.withoutEmployeeFilter(async () => {
     *     return await this.findOneByIdString(planId);
     * });
     * ```
     */
    protected withoutEmployeeFilter<R>(callback: () => Promise<R>): Promise<R>;
    /**
     * Define find conditions when retrieving data with tenant by user.
     *
     * @param user - The user for whom the conditions are defined.
     * @returns The find conditions based on the user's relationship with the tenant and employees.
     */
    private findConditionsWithTenantByUser;
    /**
     * Define find conditions when retrieving data with tenant.
     *
     * @param user - The user for whom the conditions are defined.
     * @param where - Additional find options.
     * @returns The find conditions based on the user's relationship with the tenant and additional options.
     */
    private findConditionsWithTenant;
    /**
     * Define find one options when retrieving data with tenant.
     *
     * @param filter - Additional find options.
     * @returns The find one options based on the current user's relationship with the tenant and additional options.
     */
    private findOneWithTenant;
    /**
     * Define find many options when retrieving data with tenant.
     *
     * @param filter - Additional find options.
     * @returns The find many options based on the current user's relationship with the tenant and additional options.
     */
    private findManyWithTenant;
    /**
     * Counts entities that match given options.
     * Useful for pagination.
     *
     * @param options
     * @returns
     */
    count(options?: LegacyFindManyOptions<T>): Promise<number>;
    /**
     * Counts entities that match given options.
     * Useful for pagination.
     *
     * @param options
     * @returns
     */
    countBy(options?: FindOptionsWhere<T>): Promise<number>;
    /**
     * Finds entities that match given find options.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     *
     * @param filter
     * @returns
     */
    findAll(filter?: LegacyFindManyOptions<T>): Promise<IPagination<T>>;
    /**
     * Finds entities that match given find options.
     *
     * @param filter
     * @returns
     */
    find(filter?: LegacyFindManyOptions<T>): Promise<T[]>;
    /**
     * Finds entities that match given find options.
     * Also counts all entities that match given conditions,
     * But includes pagination settings
     *
     * @param filter
     * @returns
     */
    paginate(filter?: LegacyFindManyOptions<T>): Promise<IPagination<T>>;
    /**
     * Finds first entity by a given find options with current tenant.
     * If entity was not found in the database - rejects with error.
     *
     * @param id
     * @param options
     * @returns
     */
    findOneOrFailByIdString(id: ID, options?: LegacyFindOneOptions<T>): Promise<ITryRequest<T>>;
    /**
     * Finds first entity that matches given options with current tenant.
     * If entity was not found in the database - rejects with error.
     *
     * @param options
     * @returns
     */
    findOneOrFailByOptions(options?: LegacyFindOneOptions<T>): Promise<ITryRequest<T>>;
    /**
     * Finds first entity that matches given where condition with current tenant.
     * If entity was not found in the database - rejects with error.
     *
     * @param options
     * @returns
     */
    findOneOrFailByWhereOptions(options: FindOptionsWhere<T>): Promise<ITryRequest<T>>;
    /**
     * Finds first entity by a given find options with current tenant.
     * If entity was not found in the database - returns null.
     *
     * @param id
     * @param options
     * @returns
     */
    findOneByIdString(id: ID, options?: LegacyFindOneOptions<T>): Promise<T>;
    /**
     * Finds first entity that matches given options with current tenant.
     * If entity was not found in the database - returns null.
     *
     * @param options
     * @returns
     */
    findOneByOptions(options: LegacyFindOneOptions<T>): Promise<T>;
    /**
     * Finds first entity that matches given where condition with current tenant.
     * If entity was not found in the database - returns null.
     *
     * @param options
     * @returns
     */
    findOneByWhereOptions(options: FindOptionsWhere<T>): Promise<T>;
    /**
     * Refuses to persist an entity whose id already names a row of ANOTHER tenant.
     *
     * create()/save() with an id are upserts: TypeORM's save() looks the row up by primary key only and
     * then UPDATEs it, while this service merely stamps the caller's tenantId onto the payload. A body
     * that smuggled a foreign id in (`{ id, ...body }` spreads, un-whitelisted update DTOs) therefore
     * overwrote — and re-tenanted — another tenant's row (GHSA-gwpq-mmw7-vx85 / GHSA-x4mv-fhwj-g3rp
     * class). Rows the caller's tenant owns, and ids that do not exist yet, are untouched.
     *
     * @param entity - The payload about to be persisted.
     * @param tenantId - The caller's tenant.
     */
    protected assertNotForeignRow(entity: IPartialEntity<T>, tenantId: ID | null): Promise<void>;
    /**
     * Batch form of {@link assertNotForeignRow} for createMany()/saveMany() (one lookup for all ids).
     */
    protected assertNotForeignRows(entities: IPartialEntity<T>[], tenantId: ID | null): Promise<void>;
    /**
     * Creates a new entity instance and copies all entity properties from this object into a new entity.
     * Note that it copies only properties that are present in entity schema.
     *
     * @param entity
     * @returns
     */
    create(entity: IPartialEntity<T>): Promise<T>;
    /**
     * Creates multiple new entities in a single bulk operation with tenant scoping.
     * Enriches all entities with tenantId and employeeId (same logic as create()).
     * More efficient than calling create() in a loop.
     *
     * @param entities The array of partial entity data for creation.
     * @returns The array of created entities.
     */
    createMany(entities: IPartialEntity<T>[]): Promise<T[]>;
    /**
     * Saves a given entity in the database.
     * If entity does not exist in the database then inserts, otherwise updates.
     *
     * @param entity
     * @returns
     */
    save(entity: IPartialEntity<T>): Promise<T>;
    /**
     * Saves a given entity without automatic tenantId enrichment.
     * This is the same as CrudService.save() and is useful for operations
     * where the entity might belong to a different tenant.
     *
     * @param entity The partial entity data.
     * @returns The saved entity.
     */
    protected saveWithoutEnrichment(entity: IPartialEntity<T>): Promise<T>;
    /**
     * Saves multiple entities in a single bulk operation with tenant scoping.
     * Enriches all entities with tenantId (same logic as save()).
     * More efficient than calling save() in a loop.
     *
     * NOTE: Any tenant or tenantId properties on provided entities will be OVERWRITTEN with
     * RequestContext.currentTenantId() (consistent with save() behavior). Callers passing
     * per-entity tenant values should be aware they will be replaced to prevent silent
     * data loss and ensure correct scoping. (Reference: related usage in
     * bulkCreateTenantsStatus/status.service where this caused issues).
     *
     * @param entities The array of partial entity data.
     * @returns The array of saved entities.
     */
    saveMany(entities: IPartialEntity<T>[]): Promise<T[]>;
    /**
     * Saves multiple entities without automatic tenantId enrichment.
     * This is the same as CrudService.saveMany() and is useful for bulk operations
     * where entities might belong to different tenants.
     *
     * @param entities The array of partial entity data.
     * @returns The array of saved entities.
     */
    protected saveManyWithoutEnrichment(entities: IPartialEntity<T>[]): Promise<T[]>;
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     *
     * @param id
     * @param partialEntity
     * @returns
     */
    update(id: string | FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T | UpdateResult>;
    /**
     * DELETE source related to tenant
     *
     * @param criteria - A string ID or a set of conditions to identify which record to delete.
     * @param options - Additional options for querying, such as extra conditions or query parameters.
     * @returns {Promise<DeleteResult>} - The result of the delete operation.
     */
    delete(criteria: string | FindOptionsWhere<T>, options?: LegacyFindOneOptions<T>): Promise<DeleteResult>;
    /**
     * Deletes multiple records by their IDs with tenant scoping.
     * Verifies records exist within the current tenant before deletion.
     *
     * @param ids - An array of entity IDs to delete.
     * @returns {Promise<DeleteResult>} - Result indicating the number of affected records.
     */
    deleteMany(ids: ID[]): Promise<DeleteResult>;
    /**
     * Softly deletes entities by a given criteria.
     * This method sets a flag or timestamp indicating the entity is considered deleted.
     * It does not actually remove the entity from the database, allowing for recovery or audit purposes.
     *
     * @param criteria - Entity ID or complex query to identify which entity to soft-delete.
     * @param options - Additional options for the operation.
     * @returns {Promise<DeleteResult>} - Result indicating success or failure.
     */
    softDelete(criteria: string | number | FindOptionsWhere<T>, options?: LegacyFindOneOptions<T>): Promise<UpdateResult | T>;
}
