"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = exports.ALLOWED_DOCUMENT_RELATIONS = void 0;
exports.toRelationList = toRelationList;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const docs_config_1 = require("../docs.config");
const bulk_document_action_command_1 = require("../commands/bulk-document-action.command");
const create_document_command_1 = require("../commands/create-document.command");
const update_document_command_1 = require("../commands/update-document.command");
const update_document_content_command_1 = require("../commands/update-document-content.command");
const dto_1 = require("../dto");
const document_entity_1 = require("../entities/document.entity");
const get_document_query_1 = require("../queries/get-document.query");
const get_document_count_query_1 = require("../queries/get-document-count.query");
const get_document_facets_query_1 = require("../queries/get-document-facets.query");
const get_document_path_query_1 = require("../queries/get-document-path.query");
const get_documents_query_1 = require("../queries/get-documents.query");
/**
 * Relations a client may ask `GET /documents/:id` to join.
 *
 * 🛑 This is an **allowlist, and `children` is deliberately absent.** The row-level gate of
 * `findOneScoped()` proves the *requested* document is readable; it says nothing about the rows
 * TypeORM eager-loads alongside it. `?relations=children` therefore used to return every child of
 * a readable folder — including other people's `PRIVATE` pages, with `contentJson` and
 * `contentHtml` in full (`08-permissions-security.md` §3.4 row 6: unreadable ⇒ 404, never a
 * payload). Child listing has its own scoped route, `GET /documents?parentId=<id>`, which applies
 * the visibility predicate in SQL; the breadcrumb has `GET /documents/:id/path`, which masks
 * unreadable ancestors. Anything added here must be a relation whose rows carry no per-row
 * visibility of their own — or it needs the same post-load scrubbing `parent` gets in
 * `DocumentService.findOneScoped()`.
 *
 * `createdByUser` / `updatedByUser` satisfy that bar: they are the `ManyToOne → User` actor
 * relations every `BaseEntity` carries, they hold no document content, and a `User` has no
 * per-row visibility to scrub. The detail panel joins them to render the "Created by" / "Updated
 * by" rows of the metadata grid (`01-ux-spec.md` §8.4) — dropping them here would not error, it
 * would silently degrade both rows to a bare timestamp.
 */
exports.ALLOWED_DOCUMENT_RELATIONS = [
    'parent',
    'tags',
    'categories',
    'reviewedBy',
    'createdByUser',
    'updatedByUser'
];
/**
 * Normalizes the `relations` query parameter into the array the query handler expects, keeping
 * only the allowlisted names.
 *
 * Express hands over a string for one `?relations=` occurrence and an array for several; an absent
 * (or empty) value means "no relations". An unknown or non-allowlisted name is dropped rather than
 * rejected: `relations` is an optimization hint, and a client asking for one relation too many
 * should get a correctly-scoped document, not a 400 that breaks its whole detail panel.
 *
 * @param relations The raw query-parameter value.
 * @returns The allowlisted relation names to join.
 */
function toRelationList(relations) {
    const requested = Array.isArray(relations) ? relations : relations ? [relations] : [];
    return requested.filter((relation) => exports.ALLOWED_DOCUMENT_RELATIONS.includes(relation));
}
let DocumentController = class DocumentController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * Retrieves a paginated, filtered document list. List projections never include content
     * columns — they carry `hasContent`/`hasExtractedText`/`hasChildren`/`childrenCount` instead.
     */
    async findAll(params) {
        return this.queryBus.execute(new get_documents_query_1.GetDocumentsQuery(params));
    }
    /**
     * Retrieves the document count for the same filter set as the list.
     */
    async getCount(params) {
        return this.queryBus.execute(new get_document_count_query_1.GetDocumentCountQuery(params));
    }
    /**
     * Retrieves facet counts for the filter chips (each bucket computed over the other filters).
     */
    async getFacets(params) {
        return this.queryBus.execute(new get_document_facets_query_1.GetDocumentFacetsQuery(params));
    }
    /**
     * Creates a FOLDER or PAGE document (`kind: FILE` → 400 `DOCS_FILE_VIA_UPLOAD`).
     */
    async create(input) {
        return this.commandBus.execute(new create_document_command_1.CreateDocumentCommand(input));
    }
    /**
     * Applies one bulk action to up to 200 documents with per-id partial failure (one HTTP 200).
     */
    async bulk(input) {
        return this.commandBus.execute(new bulk_document_action_command_1.BulkDocumentActionCommand(input));
    }
    /**
     * Partial **metadata-only** update — content fields are rejected here (`forbidNonWhitelisted`);
     * PAGE content saves go through `PUT /:id/content`.
     */
    async update(id, input) {
        return this.commandBus.execute(new update_document_command_1.UpdateDocumentCommand(id, input));
    }
    /**
     * PAGE content save. Stale `expectedUpdatedAt` → 409 `DOCS_CONTENT_CONFLICT`; locked
     * document → 423 `DOCS_LOCKED`. `forceSnapshot: true` bypasses the version-snapshot debounce.
     */
    async updateContent(id, input) {
        return this.commandBus.execute(new update_document_content_command_1.UpdateDocumentContentCommand(id, input));
    }
    /**
     * Resolves the breadcrumb chain of a document, root → document.
     *
     * Server-side because the masking rule of `08-permissions-security.md` §3.2 cannot be applied
     * in the client: an ancestor the requester may not read is returned as
     * `{ id: null, restricted: true }` with **no name and no id**, and the client renders it as the
     * `DOCS.BREADCRUMB.RESTRICTED` lock chip.
     *
     * Declared before `GET /:id` so the static `/path` segment is never swallowed by it.
     */
    async getPath(id) {
        return this.queryBus.execute(new get_document_path_query_1.GetDocumentPathQuery(id));
    }
    /**
     * Retrieves a single document by id (`relations` query param honored).
     *
     * `organizationId` is the client's selected organization. Without it the scope is resolved
     * from the token's `lastOrganizationId`, which is null for non-employee users (400) and stale
     * when the client browses another organization of the tenant (404 on rows the list showed).
     * `relations` stays a raw `@Query('relations')` extraction on purpose: its metatype is not a
     * DTO class, so the route's ValidationPipe skips it and `toRelationList` remains the gate.
     */
    async findById(id, relations, query) {
        return this.queryBus.execute(new get_document_query_1.GetDocumentQuery(id, toRelationList(relations), query?.organizationId));
    }
};
exports.DocumentController = DocumentController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a paginated, filtered list of documents.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'List of documents retrieved successfully.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.GetDocumentsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get document count for a filter set.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Successfully retrieved the document count.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Get)('/count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.GetDocumentsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get facet counts for the filter chips.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Facet counts retrieved successfully.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Get)('/facets'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.GetDocumentsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getFacets", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a FOLDER or PAGE document.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Document created successfully.', type: document_entity_1.Document }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input provided.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_CREATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateDocumentDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Apply a bulk action to a set of documents.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Per-id bulk results returned.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_MANAGE, contracts_1.PermissionsEnum.DOCS_REVIEW),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true })
    // One request fans out to up to 200 documents (`08-permissions-security.md` §9).
    ,
    (0, throttler_1.Throttle)((0, docs_config_1.docsRateLimit)((0, docs_config_1.getDocsConfig)().adminOpsRateLimit)),
    (0, common_1.Post)('/bulk'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.BulkDocumentActionDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "bulk", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update document metadata by ID.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Document updated successfully.', type: document_entity_1.Document }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Document not found.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateDocumentDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Save PAGE content (optimistic concurrency + version snapshot).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Content saved successfully.', type: document_entity_1.Document }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Content changed since it was loaded.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Put)('/:id/content'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateDocumentContentDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "updateContent", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get the breadcrumb path of a document (unreadable ancestors masked).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Breadcrumb segments, root first.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Document not found.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, common_1.Get)('/:id/path'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getPath", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get document by ID.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Document retrieved successfully.', type: document_entity_1.Document }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Document not found.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('relations')),
    tslib_1.__param(2, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, dto_1.DocumentScopeQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "findById", null);
exports.DocumentController = DocumentController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard, core_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_DOCUMENTS),
    (0, common_1.Controller)('/plugins/docs/documents'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], DocumentController);
//# sourceMappingURL=document.controller.js.map