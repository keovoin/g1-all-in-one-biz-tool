"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentStatsHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_stats_service_1 = require("../../services/document-stats.service");
const get_document_stats_query_1 = require("../get-document-stats.query");
let GetDocumentStatsHandler = class GetDocumentStatsHandler {
    constructor(documentStatsService) {
        this.documentStatsService = documentStatsService;
    }
    /**
     * Handles the `GetDocumentStatsQuery`: org-global counts for the stats tiles
     * (status totals, needs-review, storage quota state).
     *
     * @param query - The query carrying the organization scope.
     * @returns The stats envelope.
     */
    async execute(query) {
        return this.documentStatsService.getDocumentStats(query.params);
    }
};
exports.GetDocumentStatsHandler = GetDocumentStatsHandler;
exports.GetDocumentStatsHandler = GetDocumentStatsHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_document_stats_query_1.GetDocumentStatsQuery),
    tslib_1.__metadata("design:paramtypes", [document_stats_service_1.DocumentStatsService])
], GetDocumentStatsHandler);
//# sourceMappingURL=get-document-stats.handler.js.map