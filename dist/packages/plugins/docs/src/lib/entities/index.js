"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_DOC_ENTITIES = exports.DocumentVersion = exports.DocumentShare = exports.DocumentLink = exports.DocumentIndexState = exports.DocumentInboundAddress = exports.DocumentChunk = exports.DocumentCategory = exports.Document = void 0;
const document_entity_1 = require("./document.entity");
const document_category_entity_1 = require("./document-category.entity");
const document_chunk_entity_1 = require("./document-chunk.entity");
const document_inbound_address_entity_1 = require("./document-inbound-address.entity");
const document_index_state_entity_1 = require("./document-index-state.entity");
const document_link_entity_1 = require("./document-link.entity");
const document_share_entity_1 = require("./document-share.entity");
const document_version_entity_1 = require("./document-version.entity");
var document_entity_2 = require("./document.entity");
Object.defineProperty(exports, "Document", { enumerable: true, get: function () { return document_entity_2.Document; } });
var document_category_entity_2 = require("./document-category.entity");
Object.defineProperty(exports, "DocumentCategory", { enumerable: true, get: function () { return document_category_entity_2.DocumentCategory; } });
var document_chunk_entity_2 = require("./document-chunk.entity");
Object.defineProperty(exports, "DocumentChunk", { enumerable: true, get: function () { return document_chunk_entity_2.DocumentChunk; } });
var document_inbound_address_entity_2 = require("./document-inbound-address.entity");
Object.defineProperty(exports, "DocumentInboundAddress", { enumerable: true, get: function () { return document_inbound_address_entity_2.DocumentInboundAddress; } });
var document_index_state_entity_2 = require("./document-index-state.entity");
Object.defineProperty(exports, "DocumentIndexState", { enumerable: true, get: function () { return document_index_state_entity_2.DocumentIndexState; } });
var document_link_entity_2 = require("./document-link.entity");
Object.defineProperty(exports, "DocumentLink", { enumerable: true, get: function () { return document_link_entity_2.DocumentLink; } });
var document_share_entity_2 = require("./document-share.entity");
Object.defineProperty(exports, "DocumentShare", { enumerable: true, get: function () { return document_share_entity_2.DocumentShare; } });
var document_version_entity_2 = require("./document-version.entity");
Object.defineProperty(exports, "DocumentVersion", { enumerable: true, get: function () { return document_version_entity_2.DocumentVersion; } });
/**
 * Every entity shipped by the Documents plugin — the single source for `@Plugin({ entities })`
 * and the `forFeature` arrays in `DocsModule`.
 */
exports.ALL_DOC_ENTITIES = [
    document_entity_1.Document,
    document_category_entity_1.DocumentCategory,
    document_version_entity_1.DocumentVersion,
    document_chunk_entity_1.DocumentChunk,
    document_index_state_entity_1.DocumentIndexState,
    document_share_entity_1.DocumentShare,
    document_link_entity_1.DocumentLink,
    document_inbound_address_entity_1.DocumentInboundAddress
];
//# sourceMappingURL=index.js.map