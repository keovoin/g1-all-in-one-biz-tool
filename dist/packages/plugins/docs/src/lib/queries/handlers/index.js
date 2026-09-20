"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryHandlers = void 0;
const get_document_handler_1 = require("./get-document.handler");
const get_document_categories_handler_1 = require("./get-document-categories.handler");
const get_document_count_handler_1 = require("./get-document-count.handler");
const get_document_facets_handler_1 = require("./get-document-facets.handler");
const get_document_links_handler_1 = require("./get-document-links.handler");
const get_document_path_handler_1 = require("./get-document-path.handler");
const get_document_settings_handler_1 = require("./get-document-settings.handler");
const get_document_stats_handler_1 = require("./get-document-stats.handler");
const get_document_version_handler_1 = require("./get-document-version.handler");
const get_document_versions_handler_1 = require("./get-document-versions.handler");
const get_documents_handler_1 = require("./get-documents.handler");
exports.QueryHandlers = [
    get_document_handler_1.GetDocumentHandler,
    get_document_categories_handler_1.GetDocumentCategoriesHandler,
    get_document_count_handler_1.GetDocumentCountHandler,
    get_document_facets_handler_1.GetDocumentFacetsHandler,
    get_document_links_handler_1.GetDocumentLinksHandler,
    get_document_path_handler_1.GetDocumentPathHandler,
    get_document_settings_handler_1.GetDocumentSettingsHandler,
    get_document_stats_handler_1.GetDocumentStatsHandler,
    get_document_version_handler_1.GetDocumentVersionHandler,
    get_document_versions_handler_1.GetDocumentVersionsHandler,
    get_documents_handler_1.GetDocumentsHandler
];
//# sourceMappingURL=index.js.map