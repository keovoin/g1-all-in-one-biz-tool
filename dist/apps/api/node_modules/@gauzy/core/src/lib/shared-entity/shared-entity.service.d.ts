import { DataSource, FindOptionsWhere, UpdateResult } from "typeorm";
import { ID, ISharedEntityCreateInput } from "@gauzy/contracts";
import { TenantAwareCrudService } from "../core/crud";
import { MikroOrmSharedEntityRepository } from "./repository/mikro-orm-shared-entity.repository";
import { TypeOrmSharedEntityRepository } from "./repository/type-orm-shared-entity.repository";
import { SharedEntity } from "./shared-entity.entity";
export declare class SharedEntityService extends TenantAwareCrudService<SharedEntity> {
    private readonly dataSource;
    constructor(dataSource: DataSource, typeOrmSharedEntityRepository: TypeOrmSharedEntityRepository, mikroOrmSharedEntityRepository: MikroOrmSharedEntityRepository);
    /**
     * Creates a new shared entity.
     *
     * @param input - The input data for creating a shared entity.
     * @returns A promise that resolves to the created shared entity.
     * @throws {BadRequestException} If an error occurs during the creation of the shared entity.
     */
    create(input: ISharedEntityCreateInput): Promise<SharedEntity>;
    /**
     * Gets a shared entity by token.
     *
     * @param token - The token of the shared entity.
     * @returns The shared entity.
     * @throws {NotFoundException} If the shared entity is not found.
     */
    getSharedEntityByToken(token: string): Promise<any>;
    /**
     * Builds the find options for the shared entity.
     *
     * @param repository - The repository for the target entity (used to detect tenant/org columns).
     * @param entityId - The ID of the entity.
     * @param tenantId - The tenant ID the shared entity belongs to (used to enforce tenant isolation).
     * @param organizationId - The organization ID the shared entity belongs to (org-scoped isolation).
     * @param rules - The share rules for the shared entity.
     * @returns The find options for the shared entity.
     */
    private buildFindOptions;
    /**
     * Builds a tenant- (and organization-) scoped `where` clause for a target entity.
     *
     * The `tenantId`/`organizationId` predicates are only added when the target entity actually has
     * those columns. Some shareable entity types (e.g. Tenant, Language, Currency) are global and have
     * no `tenantId` column; adding it unconditionally would either error or silently degrade the lookup
     * to `id`-only (no isolation).
     *
     * @param repository - The repository for the target entity.
     * @param entityId - The ID of the entity.
     * @param tenantId - The caller's/share's tenant ID.
     * @param organizationId - The caller's/share's organization ID.
     * @returns A `where` object scoped by the columns the entity actually has.
     */
    private buildScopedWhere;
    /**
     * Updates a share. The target (entity/entityId) and the token are pinned at creation and never
     * client-editable; when the rules change they are re-validated against the target's metadata.
     *
     * @param id - The shared entity id.
     * @param input - The update payload.
     * @returns The updated shared entity.
     */
    update(id: ID | number | FindOptionsWhere<SharedEntity>, input: Partial<SharedEntity>): Promise<SharedEntity | UpdateResult>;
    /**
     * shareRules is stored as JSON(B) on Postgres/MySQL and as text on SQLite; normalise to an object.
     *
     * @param shareRules - The stored or submitted rules.
     */
    private parseShareRules;
    /**
     * Resolves the repository for the given entity name.
     *
     * @param entityName - The name of the entity.
     * @returns The repository for the given entity name.
     * @throws {BadRequestException} If the repository for the given entity name is not found.
     */
    private resolveRepository;
}
