"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Capture channels (`07-ai-knowledge.md` §17) — the provider-based seams through which
 * documents arrive from outside the Documents UI: integration importers, inbound email,
 * and AI-chat attachments. Every channel produces ordinary `document` rows that then ride
 * the standard pipeline unchanged, and none of them auto-imports into AI knowledge.
 */
tslib_1.__exportStar(require("./document-importer.interface"), exports);
tslib_1.__exportStar(require("./inbound-email.types"), exports);
tslib_1.__exportStar(require("./generic-signed-webhook.adapter"), exports);
tslib_1.__exportStar(require("./inbound-address.service"), exports);
tslib_1.__exportStar(require("./inbound-email.service"), exports);
tslib_1.__exportStar(require("./inbound-email.controller"), exports);
tslib_1.__exportStar(require("./chat-capture.subscriber"), exports);
//# sourceMappingURL=index.js.map