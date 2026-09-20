"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentStatsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const dto_1 = require("../dto");
const get_document_stats_query_1 = require("../queries/get-document-stats.query");
/**
 * `GET /plugins/docs/documents/stats` — org-global counts for the browse page's
 * stats tiles.
 *
 * 🛑 A separate controller on purpose: the static `/stats` segment must be
 * registered BEFORE `DocumentController`'s `/:id` routes or Nest resolves it into
 * `GET /documents/:id` (a UUID-pipe 400). Nest keeps declaration order across
 * controllers, so this controller precedes `DocumentController` in the barrel's
 * `Controllers` array — moving it after is a silent route shadowing.
 */
let DocumentStatsController = class DocumentStatsController {
    constructor(queryBus) {
        this.queryBus = queryBus;
    }
    /**
     * Org-global document counts (status totals, needs-review, storage quota state).
     * Filters beyond the mandatory `where` organization scope are ignored — tile
     * numbers are stable while the user filters (the facets endpoint is the
     * filter-relative one).
     */
    async getStats(params) {
        return this.queryBus.execute(new get_document_stats_query_1.GetDocumentStatsQuery(params));
    }
};
exports.DocumentStatsController = DocumentStatsController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get org-global document stats for the hub tiles.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Document stats retrieved successfully.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Get)('/stats'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.GetDocumentsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentStatsController.prototype, "getStats", null);
exports.DocumentStatsController = DocumentStatsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard, core_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_DOCUMENTS),
    (0, common_1.Controller)('/plugins/docs/documents'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus])
], DocumentStatsController);
//# sourceMappingURL=document-stats.controller.js.map