"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentInboundDomainStatusEnum = exports.DocumentInboundAddressKindEnum = exports.DocumentShareAccessEnum = exports.DocumentVisibilityEnum = exports.DocumentReviewReasonEnum = exports.DocumentReviewStatusEnum = exports.DocumentKnowledgeStatusEnum = exports.DocumentSourceEnum = exports.DocumentStatusEnum = exports.DocumentKindEnum = void 0;
/**
 * Document node kind enum
 *
 * The Documents tree has a single node type discriminated by `kind`:
 * folders and pages can contain children; files are leaves.
 */
var DocumentKindEnum;
(function (DocumentKindEnum) {
    DocumentKindEnum["FOLDER"] = "FOLDER";
    DocumentKindEnum["PAGE"] = "PAGE";
    DocumentKindEnum["FILE"] = "FILE";
})(DocumentKindEnum || (exports.DocumentKindEnum = DocumentKindEnum = {}));
/**
 * Document processing status enum
 *
 * FILE documents are born `UPLOADED` and run the processing pipeline;
 * PAGE/FOLDER documents are born `READY`.
 */
var DocumentStatusEnum;
(function (DocumentStatusEnum) {
    DocumentStatusEnum["UPLOADED"] = "UPLOADED";
    DocumentStatusEnum["PROCESSING"] = "PROCESSING";
    DocumentStatusEnum["READY"] = "READY";
    DocumentStatusEnum["FAILED"] = "FAILED";
})(DocumentStatusEnum || (exports.DocumentStatusEnum = DocumentStatusEnum = {}));
/**
 * Document source enum
 *
 * How the document entered the platform. Immutable after create.
 */
var DocumentSourceEnum;
(function (DocumentSourceEnum) {
    DocumentSourceEnum["UPLOAD"] = "UPLOAD";
    DocumentSourceEnum["EDITOR"] = "EDITOR";
    DocumentSourceEnum["CHAT"] = "CHAT";
    DocumentSourceEnum["EMAIL"] = "EMAIL";
    DocumentSourceEnum["INTEGRATION"] = "INTEGRATION";
    DocumentSourceEnum["SYSTEM"] = "SYSTEM";
    DocumentSourceEnum["IMPORT"] = "IMPORT";
})(DocumentSourceEnum || (exports.DocumentSourceEnum = DocumentSourceEnum = {}));
/**
 * Document AI knowledge status enum
 *
 * Importing into AI knowledge is a choice, not automatic — plain uploads stay `NONE`;
 * `EXCLUDED` means explicitly opted out.
 */
var DocumentKnowledgeStatusEnum;
(function (DocumentKnowledgeStatusEnum) {
    DocumentKnowledgeStatusEnum["NONE"] = "NONE";
    DocumentKnowledgeStatusEnum["QUEUED"] = "QUEUED";
    DocumentKnowledgeStatusEnum["INDEXING"] = "INDEXING";
    DocumentKnowledgeStatusEnum["INDEXED"] = "INDEXED";
    DocumentKnowledgeStatusEnum["FAILED"] = "FAILED";
    DocumentKnowledgeStatusEnum["EXCLUDED"] = "EXCLUDED";
})(DocumentKnowledgeStatusEnum || (exports.DocumentKnowledgeStatusEnum = DocumentKnowledgeStatusEnum = {}));
/**
 * Document review status enum
 *
 * The review circuit breaker: a `PENDING` document with an AI-related review reason
 * is excluded from AI retrieval until approved.
 */
var DocumentReviewStatusEnum;
(function (DocumentReviewStatusEnum) {
    DocumentReviewStatusEnum["NONE"] = "NONE";
    DocumentReviewStatusEnum["PENDING"] = "PENDING";
    DocumentReviewStatusEnum["APPROVED"] = "APPROVED";
    DocumentReviewStatusEnum["REJECTED"] = "REJECTED";
})(DocumentReviewStatusEnum || (exports.DocumentReviewStatusEnum = DocumentReviewStatusEnum = {}));
/**
 * Document review reason enum
 *
 * Wire/storage values are kebab-case; keys are SCREAMING_CASE.
 */
var DocumentReviewReasonEnum;
(function (DocumentReviewReasonEnum) {
    DocumentReviewReasonEnum["EXTRACTION_FAILED"] = "extraction-failed";
    DocumentReviewReasonEnum["LOW_CONFIDENCE"] = "low-confidence";
    DocumentReviewReasonEnum["AI_GENERATED"] = "ai-generated";
    DocumentReviewReasonEnum["MANUAL"] = "manual";
})(DocumentReviewReasonEnum || (exports.DocumentReviewReasonEnum = DocumentReviewReasonEnum = {}));
/**
 * Document visibility enum
 *
 * `ORGANIZATION` documents are visible to everyone in the organization holding read
 * permission; `PRIVATE` documents are visible to the creator, admins, and explicit
 * share grantees. Children do not inherit visibility.
 */
var DocumentVisibilityEnum;
(function (DocumentVisibilityEnum) {
    DocumentVisibilityEnum["ORGANIZATION"] = "ORGANIZATION";
    DocumentVisibilityEnum["PRIVATE"] = "PRIVATE";
})(DocumentVisibilityEnum || (exports.DocumentVisibilityEnum = DocumentVisibilityEnum = {}));
/**
 * Document share access enum
 *
 * `VIEW` (read only) · `COMMENT` (read + comment) · `EDIT` (read + comment + modify
 * content/metadata). Escalation beyond `EDIT` always requires ownership or manage rights.
 */
var DocumentShareAccessEnum;
(function (DocumentShareAccessEnum) {
    DocumentShareAccessEnum["VIEW"] = "VIEW";
    DocumentShareAccessEnum["COMMENT"] = "COMMENT";
    DocumentShareAccessEnum["EDIT"] = "EDIT";
})(DocumentShareAccessEnum || (exports.DocumentShareAccessEnum = DocumentShareAccessEnum = {}));
/**
 * How an organization's inbound capture address is hosted.
 *
 * `PLATFORM` — the zero-config default. The address lives on the deployment-wide inbound domain
 * (`GAUZY_DOCS_INBOUND_DOMAIN`) and is distinguished only by an unguessable per-organization token:
 * `docs-<token>@<platform domain>`. One relay, one webhook secret, every tenant served.
 *
 * `CUSTOM_DOMAIN` — the organization publishes its own domain and routes it at us. The address is
 * `<localPart>@<domain>` with a local part they choose, so it can be `docs@acme.com`. Because the
 * local part is then guessable, ownership of the domain must be proven before the address is armed.
 */
var DocumentInboundAddressKindEnum;
(function (DocumentInboundAddressKindEnum) {
    DocumentInboundAddressKindEnum["PLATFORM"] = "PLATFORM";
    DocumentInboundAddressKindEnum["CUSTOM_DOMAIN"] = "CUSTOM_DOMAIN";
})(DocumentInboundAddressKindEnum || (exports.DocumentInboundAddressKindEnum = DocumentInboundAddressKindEnum = {}));
/**
 * Lifecycle of a `CUSTOM_DOMAIN` address. `PLATFORM` addresses are born `VERIFIED` — there is
 * nothing to prove, the platform already owns the domain.
 */
var DocumentInboundDomainStatusEnum;
(function (DocumentInboundDomainStatusEnum) {
    /** Created, DNS record not yet observed. Mail to this address is REJECTED. */
    DocumentInboundDomainStatusEnum["PENDING"] = "PENDING";
    /** The expected TXT record was observed. Mail is accepted. */
    DocumentInboundDomainStatusEnum["VERIFIED"] = "VERIFIED";
    /** Previously verified, but the record has since disappeared. Mail is REJECTED again. */
    DocumentInboundDomainStatusEnum["FAILED"] = "FAILED";
})(DocumentInboundDomainStatusEnum || (exports.DocumentInboundDomainStatusEnum = DocumentInboundDomainStatusEnum = {}));
//# sourceMappingURL=document.model.js.map