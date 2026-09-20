"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentVersionsQueryDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@gauzy/core");
/**
 * Query params for `GET /documents/:id/versions`.
 *
 * The route used to type its query as the platform's `BaseQueryDTO`. Every DTO in that family
 * descends from `FindWhereQueryDTO`, whose `where` is `@IsNotEmpty()`, so with
 * `@UseValidationPipe(...)` the route answered EVERY call with
 * `400 {"message":["where should not be empty"]}` before the handler ran. The client has nothing to
 * filter on and correctly sends no query string, so version history was broken for every user, not
 * just for the e2e suite: the editor's panel caught the error and rendered `DOCS.ERRORS.PANEL_LOAD`
 * ("Couldn't load this document") with a Retry that could never succeed.
 *
 * Nothing ever read that `where`. `GetDocumentVersionsHandler` scopes off the document named in the
 * path, and `DocumentVersionService.getVersions()` builds its own `where` from that document,
 * consuming only `take`/`skip` from here.
 *
 * So the paging half is PICKED off `BaseQueryDTO` rather than restated: same decorators, same
 * bounds, one definition — re-declaring `take`/`skip` here would drift from core the moment either
 * changed. `whitelist: true` strips properties the DTO does not declare, so dropping them entirely
 * would silently discard a caller's paging instead. The optional organization comes from a partial
 * `TenantOrganizationBaseDTO`, matching {@link DocumentScopeQueryDTO} on the sibling detail routes,
 * which keeps the platform's `@IsOrganizationBelongsToUser()` ownership check; when omitted the
 * service falls back to the request context.
 */
class GetDocumentVersionsQueryDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PickType)(core_1.BaseQueryDTO, ['take', 'skip']), (0, swagger_1.PartialType)(core_1.TenantOrganizationBaseDTO)) {
}
exports.GetDocumentVersionsQueryDTO = GetDocumentVersionsQueryDTO;
//# sourceMappingURL=get-document-versions-query.dto.js.map