"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCS_CITATIONS_DATA_PART = void 0;
exports.toCitationUrl = toCitationUrl;
const contracts_1 = require("@gauzy/contracts");
/**
 * The custom UI-message data part `docs_search` writes onto the chat stream (spec `07` §11.3,
 * `00` §6.3 R-AI-07).
 *
 * A tool's RETURN VALUE goes to the model, never to the browser in an addressable form — so the
 * clickable citation chips under an answer travel as their own `data-*` part instead. The chat
 * client renders `message.parts` of this type as chips that deep-link into the Documents hub.
 *
 * 🛑 The name is a wire contract shared with `ai-chat-react-ui`'s `DocsCitationChips`: the AI SDK
 * exposes the part client-side under exactly this `type` string. Changing it here silently stops
 * the chips from rendering — nothing else fails.
 */
exports.DOCS_CITATIONS_DATA_PART = 'data-docs-citations';
/**
 * The in-app deep link for one document.
 *
 * Mirrors `docs-ui`'s own `DocsRowActionsService.deepLink()` — a PAGE opens in the page editor,
 * everything else opens the hub with the detail panel selected. Emitted as an app-relative path
 * so the client can hand it straight to the router (`AgentPageBridgeService.openPage`) rather
 * than reloading the SPA through an absolute URL.
 *
 * @param documentId The document to link to.
 * @param kind The document kind, when known.
 * @returns The router path, e.g. `/pages/documents?id=<uuid>`.
 */
function toCitationUrl(documentId, kind) {
    return kind === contracts_1.DocumentKindEnum.PAGE ? `/pages/documents/page/${documentId}` : `/pages/documents?id=${documentId}`;
}
//# sourceMappingURL=docs-citations.js.map