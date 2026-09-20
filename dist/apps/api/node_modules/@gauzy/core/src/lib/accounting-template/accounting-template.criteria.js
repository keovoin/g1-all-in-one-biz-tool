"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalAccountingTemplateWhere = globalAccountingTemplateWhere;
exports.globalAccountingTemplateMikroWhere = globalAccountingTemplateMikroWhere;
exports.tenantAccountingTemplateWhere = tenantAccountingTemplateWhere;
const typeorm_1 = require("typeorm");
/**
 * TypeORM criteria for the GLOBAL accounting template — the seeded row that belongs to no tenant
 * and no organization (`"tenantId" IS NULL AND "organizationId" IS NULL`).
 *
 * The NULL scope MUST be spelled with the explicit `IsNull()` operator. A literal `null` used to be
 * silently dropped from the SQL by TypeORM (0.3 always, 1.0 under `invalidWhereValuesBehavior.null:
 * 'ignore'`), which turned this "global only" lookup into "any tenant's template with the same
 * language and type" — GHSA-44pv-34gx-q9p4. `IsNull()` emits `IS NULL` under every setting.
 */
function globalAccountingTemplateWhere({ languageCode, templateType }) {
    return {
        languageCode,
        templateType,
        tenantId: (0, typeorm_1.IsNull)(),
        organizationId: (0, typeorm_1.IsNull)()
    };
}
/**
 * MikroORM equivalent of {@link globalAccountingTemplateWhere}. MikroORM maps a `null` filter value
 * to `IS NULL` natively, so `null` is the correct spelling on this side.
 */
function globalAccountingTemplateMikroWhere({ languageCode, templateType }) {
    return {
        languageCode,
        templateType,
        tenantId: null,
        organizationId: null
    };
}
/**
 * Criteria for a TENANT-scoped template lookup. `organizationId` is optional: when the caller does
 * not pass one the key is left `undefined` and (under `invalidWhereValuesBehavior.undefined:
 * 'ignore'`) omitted, matching any organization inside the tenant — the long-standing behavior.
 * A `null` organizationId is deliberately normalised to `undefined` here so a client sending
 * `organizationId: null` keeps meaning "any organization" rather than `IS NULL`; any other value —
 * including an empty string — stays a predicate.
 */
function tenantAccountingTemplateWhere({ languageCode, templateType, tenantId, organizationId }) {
    return {
        languageCode,
        templateType,
        tenantId,
        ...(organizationId !== null && organizationId !== undefined ? { organizationId } : {})
    };
}
//# sourceMappingURL=accounting-template.criteria.js.map