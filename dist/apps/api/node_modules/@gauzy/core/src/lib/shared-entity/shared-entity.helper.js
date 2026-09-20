"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHARED_ENTITY_MAX_RELATION_DEPTH = exports.SHARED_ENTITY_FORBIDDEN_FIELDS = void 0;
exports.assertShareRulesAreSafe = assertShareRulesAreSafe;
exports.buildSharedEntitySelect = buildSharedEntitySelect;
exports.buildSharedEntityRelations = buildSharedEntityRelations;
exports.filterSharedEntity = filterSharedEntity;
exports.generateSharedEntityToken = generateSharedEntityToken;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const utils_1 = require("@gauzy/utils");
/**
 * Field names that must never be exposed through a shared-entity link, regardless of the
 * caller-supplied share rules. Prevents a share from naming sensitive columns such as password
 * hashes or tokens (the filtered object is a plain literal, so class-transformer `@Exclude`
 * protections on the entity class do not apply here).
 */
exports.SHARED_ENTITY_FORBIDDEN_FIELDS = new Set([
    'hash',
    'password',
    'salt',
    'refreshToken',
    'code',
    'codeExpireAt',
    'emailToken',
    'emailVerifiedAt',
    'thirdPartyId',
    'twoFactorAuthenticationSecret',
    'twoFactorRecoveryCode'
]);
/** How many relation hops a share may traverse from the root entity. */
exports.SHARED_ENTITY_MAX_RELATION_DEPTH = 2;
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
function assertShareRulesAreSafe(metadata, rules, depth = 0) {
    if (!rules || typeof rules !== 'object') {
        throw new common_1.BadRequestException('shareRules must be an object');
    }
    if (!Array.isArray(rules.fields)) {
        throw new common_1.BadRequestException('shareRules.fields must be an array');
    }
    if (rules.relations === undefined || rules.relations === null) {
        return;
    }
    if (typeof rules.relations !== 'object' || Array.isArray(rules.relations)) {
        throw new common_1.BadRequestException('shareRules.relations must be an object');
    }
    if (!Object.keys(rules.relations).length) {
        return;
    }
    if (depth >= exports.SHARED_ENTITY_MAX_RELATION_DEPTH) {
        throw new common_1.BadRequestException(`shareRules.relations may not be nested deeper than ${exports.SHARED_ENTITY_MAX_RELATION_DEPTH} levels`);
    }
    for (const [relationName, subRules] of Object.entries(rules.relations)) {
        // A `null`/non-object sub-rule is not a harmless leaf: `buildSharedEntityRelations` turns it
        // into `relation: true`, which loads the WHOLE related row (and its own eager relations) with
        // no field allow-list and no further validation of what that hop reaches.
        if (!subRules || typeof subRules !== 'object' || Array.isArray(subRules)) {
            throw new common_1.BadRequestException(`shareRules.relations["${relationName}"] must be an object with a "fields" array`);
        }
        const relation = metadata.findRelationWithPropertyPath(relationName);
        if (!relation) {
            throw new common_1.BadRequestException(`Unknown relation "${relationName}" on ${metadata.name}`);
        }
        const target = relation.inverseEntityMetadata;
        // A hop into a global (tenant-less) entity — Tenant, Language, Feature, Report, Currency,
        // Country, Integration, ... — cannot be tenant-filtered and is where cross-tenant pivots start.
        if (!target.findColumnWithPropertyPath('tenantId')) {
            throw new common_1.ForbiddenException(`Relation "${relationName}" (${target.name}) is not tenant-scoped and cannot be shared`);
        }
        assertShareRulesAreSafe(target, subRules, depth + 1);
    }
}
/**
 * Builds the select for the shared entity.
 *
 * @param rules - The share rules for the shared entity.
 * @param metadata - Metadata of the entity the rules apply to; when given, the tenant/organization
 * scope columns are always selected (never returned unless requested) so joined rows can be
 * filtered to the share's scope after the query — see {@link filterSharedEntity}.
 * @returns The select for the shared entity.
 */
function buildSharedEntitySelect(rules, metadata) {
    const select = {
        id: true // Always include the primary key for TypeORM to work correctly
    };
    if (metadata?.findColumnWithPropertyPath('tenantId'))
        select['tenantId'] = true;
    if (metadata?.findColumnWithPropertyPath('organizationId'))
        select['organizationId'] = true;
    // Add the fields to the select (never expose forbidden/sensitive columns)
    for (const field of rules.fields) {
        if (exports.SHARED_ENTITY_FORBIDDEN_FIELDS.has(field))
            continue;
        select[field] = true;
    }
    // Add the relations to the select
    if ((0, utils_1.isNotEmpty)(rules.relations)) {
        for (const [relation, subRules] of Object.entries(rules.relations)) {
            const target = metadata?.findRelationWithPropertyPath(relation)?.inverseEntityMetadata;
            // Fail CLOSED when a hop cannot be resolved: an unresolved target means `tenantId` is not
            // added to the nested select, and a joined row without a `tenantId` cannot be scope-checked
            // afterwards — on the @Public() token route that silently returns other tenants' rows.
            if (metadata && !target) {
                throw new common_1.BadRequestException(`Unknown relation "${relation}" on ${metadata.name}`);
            }
            select[relation] = buildSharedEntitySelect(subRules, target);
        }
    }
    // Return the select
    return select;
}
/**
 * Builds the relations for the shared entity.
 *
 * @param rules - The share rules for the shared entity.
 * @returns The relations for the shared entity.
 */
function buildSharedEntityRelations(rules) {
    if ((0, utils_1.isEmpty)(rules.relations))
        return {};
    const relations = {};
    // Add the relations to the relations
    for (const [relation, subRules] of Object.entries(rules.relations)) {
        relations[relation] = (0, utils_1.isEmpty)(subRules) ? true : buildSharedEntityRelations(subRules);
    }
    // Return the relations
    return relations;
}
/**
 * Whether a joined row belongs to the share's scope.
 *
 * Fails CLOSED: when the relation's target entity is known to have a `tenantId` column, a row that
 * does not present a matching value is dropped — including a row where the column was never
 * selected. "Cannot judge" must not mean "allow" on the @Public() token route: an unselected
 * `tenantId` used to make every joined row look in-scope.
 *
 * @param row - The joined row to judge.
 * @param scope - The share's tenant/organization.
 * @param metadata - Metadata of the row's entity, when it could be resolved.
 */
function isWithinScope(row, scope, metadata) {
    if (!scope || !row || typeof row !== 'object')
        return true;
    const targetIsTenantScoped = metadata ? !!metadata.findColumnWithPropertyPath('tenantId') : 'tenantId' in row;
    if (targetIsTenantScoped && String(row.tenantId ?? '') !== String(scope.tenantId)) {
        return false;
    }
    if (scope.organizationId) {
        const targetIsOrgScoped = metadata
            ? !!metadata.findColumnWithPropertyPath('organizationId')
            : 'organizationId' in row;
        // An org-scoped row must match; a row whose organizationId is null is tenant-global and kept.
        if (targetIsOrgScoped && row.organizationId && String(row.organizationId) !== String(scope.organizationId)) {
            return false;
        }
    }
    return true;
}
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
function filterSharedEntity(entity, rules, scope, metadata) {
    const result = {};
    for (const field of rules.fields) {
        if (exports.SHARED_ENTITY_FORBIDDEN_FIELDS.has(field))
            continue;
        result[field] = entity[field];
    }
    if (rules.relations) {
        for (const [relation, subRules] of Object.entries(rules.relations)) {
            if (!entity[relation])
                continue;
            const target = metadata?.findRelationWithPropertyPath(relation)?.inverseEntityMetadata;
            if (Array.isArray(entity[relation])) {
                result[relation] = entity[relation]
                    .filter((item) => isWithinScope(item, scope, target))
                    .map((item) => filterSharedEntity(item, subRules, scope, target));
            }
            else if (isWithinScope(entity[relation], scope, target)) {
                result[relation] = filterSharedEntity(entity[relation], subRules, scope, target);
            }
        }
    }
    // Return the result
    return result;
}
/**
 * Generates a unique token for the shared entity.
 *
 * @returns A string of 32 characters.
 */
function generateSharedEntityToken() {
    return (0, crypto_1.randomBytes)(16).toString('hex');
}
//# sourceMappingURL=shared-entity.helper.js.map