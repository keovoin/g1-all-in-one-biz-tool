"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildShareGrantExistsSql = buildShareGrantExistsSql;
const core_1 = require("@gauzy/core");
/**
 * Builds the `EXISTS (...)` fragment that is true when the requesting subject holds ANY
 * share (employee grant or a team they currently belong to) on the aliased document.
 *
 * Bind `shareEmployeeId` + `shareTenantId` alongside it — see `IShareScopeParameters`.
 *
 * @param documentAlias The document alias in the surrounding query (e.g. `document`, `doc`).
 * @returns The SQL fragment, dialect-prepared.
 */
function buildShareGrantExistsSql(documentAlias) {
    return (0, core_1.prepareSQLQuery)(`EXISTS (SELECT 1 FROM "document_share" "docShare" ` +
        `WHERE "docShare"."documentId" = "${documentAlias}"."id" ` +
        `AND "docShare"."tenantId" = :shareTenantId ` +
        `AND "docShare"."deletedAt" IS NULL ` +
        `AND ("docShare"."employeeId" = :shareEmployeeId ` +
        `OR "docShare"."teamId" IN (` +
        `SELECT "shareTeam"."organizationTeamId" FROM "organization_team_employee" "shareTeam" ` +
        `WHERE "shareTeam"."employeeId" = :shareEmployeeId AND "shareTeam"."deletedAt" IS NULL)))`);
}
//# sourceMappingURL=document-access.sql.js.map