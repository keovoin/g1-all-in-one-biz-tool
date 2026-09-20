"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Services = void 0;
const tslib_1 = require("tslib");
const docs_feature_service_1 = require("./docs-feature.service");
const document_service_1 = require("./document.service");
const document_access_service_1 = require("./document-access.service");
const document_category_service_1 = require("./document-category.service");
const document_knowledge_service_1 = require("./document-knowledge.service");
const document_link_service_1 = require("./document-link.service");
const document_path_service_1 = require("./document-path.service");
const document_processing_service_1 = require("./document-processing.service");
const document_quota_service_1 = require("./document-quota.service");
const document_review_service_1 = require("./document-review.service");
const document_settings_service_1 = require("./document-settings.service");
const document_share_service_1 = require("./document-share.service");
const document_stats_service_1 = require("./document-stats.service");
const document_tree_service_1 = require("./document-tree.service");
const document_upload_service_1 = require("./document-upload.service");
const document_version_service_1 = require("./document-version.service");
tslib_1.__exportStar(require("./docs-feature.service"), exports);
tslib_1.__exportStar(require("./document.service"), exports);
tslib_1.__exportStar(require("./document-access.predicate"), exports);
tslib_1.__exportStar(require("./document-access.service"), exports);
tslib_1.__exportStar(require("./document-access.sql"), exports);
tslib_1.__exportStar(require("./document-category.service"), exports);
tslib_1.__exportStar(require("./document-knowledge.service"), exports);
tslib_1.__exportStar(require("./document-link.service"), exports);
tslib_1.__exportStar(require("./document-path.service"), exports);
tslib_1.__exportStar(require("./document-processing.service"), exports);
tslib_1.__exportStar(require("./document-quota.service"), exports);
tslib_1.__exportStar(require("./document-review.service"), exports);
tslib_1.__exportStar(require("./document-settings.service"), exports);
tslib_1.__exportStar(require("./document-share.service"), exports);
tslib_1.__exportStar(require("./document-stats.service"), exports);
tslib_1.__exportStar(require("./document-tree.service"), exports);
tslib_1.__exportStar(require("./document-upload.service"), exports);
tslib_1.__exportStar(require("./document-version.service"), exports);
tslib_1.__exportStar(require("./file-sniffer"), exports);
tslib_1.__exportStar(require("./quota.calculator"), exports);
/**
 * Every domain service provider of the Documents plugin.
 *
 * `DocumentAccessService` is declared first: it owns the visibility + share composition
 * that `DocumentService` (and through it, everything else) depends on.
 */
exports.Services = [
    docs_feature_service_1.DocsFeatureService,
    document_access_service_1.DocumentAccessService,
    document_quota_service_1.DocumentQuotaService,
    document_service_1.DocumentService,
    document_path_service_1.DocumentPathService,
    document_tree_service_1.DocumentTreeService,
    document_category_service_1.DocumentCategoryService,
    document_version_service_1.DocumentVersionService,
    document_link_service_1.DocumentLinkService,
    document_share_service_1.DocumentShareService,
    document_settings_service_1.DocumentSettingsService,
    document_stats_service_1.DocumentStatsService,
    document_processing_service_1.DocumentProcessingService,
    document_upload_service_1.DocumentUploadService,
    document_knowledge_service_1.DocumentKnowledgeService,
    document_review_service_1.DocumentReviewService
];
//# sourceMappingURL=index.js.map