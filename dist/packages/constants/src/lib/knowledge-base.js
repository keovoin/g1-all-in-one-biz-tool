"use strict";
/**
 * Knowledge-base related constants.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HELP_CENTER_ARTICLE_MAX_BINARY_BYTES = void 0;
/**
 * Maximum allowed size in bytes for a binary article description upload.
 * 10 MB — chosen as a safe upper bound for rich-text editor binary payloads
 * (ProseMirror / TipTap binary documents are typically well below 1 MB).
 */
exports.HELP_CENTER_ARTICLE_MAX_BINARY_BYTES = 10 * 1024 * 1024;
//# sourceMappingURL=knowledge-base.js.map