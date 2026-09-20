"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentScopeQueryDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@gauzy/core");
/**
 * Optional organization scope for the single-document routes (`GET /documents/:id`,
 * `GET /documents/:id/links`).
 *
 * The detail routes used to resolve their scope exclusively from the request context, i.e.
 * `user.lastOrganizationId` — null for a non-employee user whose preference was never persisted
 * (every detail read then 400s while the org-carrying list routes work), and stale when the UI
 * browses another organization of the tenant (the detail read then 404s rows the list just
 * showed). Extending a partial `TenantOrganizationBaseDTO` — the same shape as the settings and
 * links query DTOs — reuses the platform's `@IsOrganizationBelongsToUser()` ownership check, so a
 * caller can never name an organization they do not belong to. When omitted, the service falls
 * back to the request context exactly as before.
 */
class DocumentScopeQueryDTO extends (0, swagger_1.PartialType)(core_1.TenantOrganizationBaseDTO) {
}
exports.DocumentScopeQueryDTO = DocumentScopeQueryDTO;
//# sourceMappingURL=document-scope-query.dto.js.map