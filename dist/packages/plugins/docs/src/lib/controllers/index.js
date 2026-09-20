"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controllers = void 0;
const tslib_1 = require("tslib");
const document_controller_1 = require("./document.controller");
const document_category_controller_1 = require("./document-category.controller");
const document_knowledge_controller_1 = require("./document-knowledge.controller");
const document_link_controller_1 = require("./document-link.controller");
const document_review_controller_1 = require("./document-review.controller");
const document_inbound_address_controller_1 = require("./document-inbound-address.controller");
const document_settings_controller_1 = require("./document-settings.controller");
const document_share_controller_1 = require("./document-share.controller");
const document_stats_controller_1 = require("./document-stats.controller");
const document_tree_controller_1 = require("./document-tree.controller");
const document_upload_controller_1 = require("./document-upload.controller");
const document_version_controller_1 = require("./document-version.controller");
tslib_1.__exportStar(require("./document.controller"), exports);
tslib_1.__exportStar(require("./document-category.controller"), exports);
tslib_1.__exportStar(require("./document-knowledge.controller"), exports);
tslib_1.__exportStar(require("./document-link.controller"), exports);
tslib_1.__exportStar(require("./document-review.controller"), exports);
tslib_1.__exportStar(require("./document-inbound-address.controller"), exports);
tslib_1.__exportStar(require("./document-settings.controller"), exports);
tslib_1.__exportStar(require("./document-share.controller"), exports);
tslib_1.__exportStar(require("./document-stats.controller"), exports);
tslib_1.__exportStar(require("./document-tree.controller"), exports);
tslib_1.__exportStar(require("./document-upload.controller"), exports);
tslib_1.__exportStar(require("./document-version.controller"), exports);
/**
 * The controllers of the Documents plugin.
 *
 * Order matters for route resolution: controllers whose static segments (`/upload`,
 * `/reorder`, `/bulk`, `/facets`, `/count`) must win over `/:id` are declared before the
 * generic ones inside each controller; across controllers Nest keeps declaration order —
 * the upload controller precedes the generic document controller so `POST /upload` never
 * falls into `/:id` handlers.
 *
 * The inbound-email capture webhook is NOT in this list: it is `@Public()` (signed webhook,
 * no JWT) and is registered separately in `DocsModule` so the guarded API surface and the
 * public capture surface never get mixed up by accident.
 */
exports.Controllers = [
    document_upload_controller_1.DocumentUploadController,
    document_knowledge_controller_1.DocumentKnowledgeController,
    document_review_controller_1.DocumentReviewController,
    // Before DocumentController: its static `/documents/stats` must beat `/documents/:id`.
    document_stats_controller_1.DocumentStatsController,
    document_controller_1.DocumentController,
    document_tree_controller_1.DocumentTreeController,
    document_version_controller_1.DocumentVersionController,
    document_category_controller_1.DocumentCategoryController,
    document_share_controller_1.DocumentShareController,
    document_link_controller_1.DocumentLinkController,
    document_settings_controller_1.DocumentSettingsController,
    document_inbound_address_controller_1.DocumentInboundAddressController
];
//# sourceMappingURL=index.js.map