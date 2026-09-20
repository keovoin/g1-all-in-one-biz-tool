import { EntityMetadata, FindOptionsRelations, FindOptionsSelect } from "typeorm";
import { ID, IShareRule } from "@gauzy/contracts";
/**
 * Field names that must never be exposed through a shared-entity link, regardless of the
 * caller-supplied share rules. Prevents a share from naming sensitive columns such as password
 * hashes or tokens (the filtered object is a plain literal, so class-transformer `@Exclude`
 * protections on the entity class do not apply here).
 */
export declare const SHARED_ENTITY_FORBIDDEN_FIELDS: ReadonlySet<string>;
/** How many relation hops a share may traverse from the root entity. */
export declare const SHARED_ENTITY_MAX_RELATION_DEPTH = 2;
/**
 * The tenant/organization scope a share was created in; joined rows outside it are dropped.
 */
export interface ISharedEntityScope {
    tenantId: ID;
    organizationId?: ID;
}
/**
 * Validates `shareRules.relations` against the entity metadata: every hop must be a real relation,
 * every hop's TARGET must be tenant-scoped (carry a `tenantId` column), and the depth is bounded.
 *
 * Why: the token route is @Public() and only the ROOT row is tenant-scoped, so a share of an owned
 * Organization could pivot through a GLOBAL entity's inverse relations into every other tenant
 * (`Organization.featureOrganizations -> feature -> featureOrganizations -> tenant -> ...`,
 * `languages -> language -> organizationLanguages -> organization`, `reportOrganizations -> report
 * -> reportOrganizations`) — GHSA-gpg5-qwjc-8hqh / GHSA-cx2q-xmh2-pc38.
 *
 * @param metadata - Metadata of the entity the rules apply to (root, then each hop's target).
 * @param rules - The share rules to validate.
 * @param depth - Current depth (internal).
 */
export declare function assertShareRulesAreSafe(metadata: EntityMetadata, rules: IShareRule, depth?: number): void;
/**
 * Builds the select for the shared entity.
 *
 * @param rules - The share rules for the shared entity.
 * @param metadata - Metadata of the entity the rules apply to; when given, the tenant/organization
 * scope columns are always selected (never returned unless requested) so joined rows can be
 * filtered to the share's scope after the query — see {@link filterSharedEntity}.
 * @returns The select for the shared entity.
 */
export declare function buildSharedEntitySelect(rules: IShareRule, metadata?: EntityMetadata): FindOptionsSelect<any>;
/**
 * Builds the relations for the shared entity.
 *
 * @param rules - The share rules for the shared entity.
 * @returns The relations for the shared entity.
 */
export declare function buildSharedEntityRelations(rules: IShareRule): FindOptionsRelations<any>;
/**
 * Filters the entity based on the share rules.
 *
 * @param entity - The entity to filter.
 * @param rules - The share rules for the shared entity.
 * @param scope - The share's tenant/organization; joined rows outside it are dropped.
 * @param metadata - Metadata of the entity the rules apply to; used to decide, per hop, whether a
 * joined row is REQUIRED to carry a matching `tenantId` (see {@link isWithinScope}).
 * @returns The filtered entity.
 */
export declare function filterSharedEntity(entity: any, rules: IShareRule, scope?: ISharedEntityScope, metadata?: EntityMetadata): any;
/**
 * Generates a unique token for the shared entity.
 *
 * @returns A string of 32 characters.
 */
export declare function generateSharedEntityToken(): string;
