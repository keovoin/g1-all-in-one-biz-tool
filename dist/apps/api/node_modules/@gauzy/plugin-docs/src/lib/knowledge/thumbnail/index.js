"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThumbnailProviders = void 0;
const tslib_1 = require("tslib");
const document_thumbnail_service_1 = require("./document-thumbnail.service");
tslib_1.__exportStar(require("./thumbnail.constants"), exports);
tslib_1.__exportStar(require("./document-thumbnail.service"), exports);
/** The thumbnail providers spread into the `DocsModule` providers array. */
exports.ThumbnailProviders = [document_thumbnail_service_1.DocumentThumbnailService];
//# sourceMappingURL=index.js.map