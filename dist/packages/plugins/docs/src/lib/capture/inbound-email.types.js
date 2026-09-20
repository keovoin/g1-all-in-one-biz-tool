"use strict";
/**
 * The provider-agnostic inbound-email seam of `07-ai-knowledge.md` §17.2.
 *
 * The plugin never speaks a specific ESP's dialect. It defines this adapter contract and
 * ships ONE reference implementation (`generic-signed-webhook.adapter.ts`); a Mailgun /
 * SendGrid / Postmark / SES adapter is a few lines in an integration plugin and is bound
 * through the `DOCS_INBOUND_EMAIL_ADAPTER` token.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCS_INBOUND_ADDRESS_RESOLVER = exports.DOCS_INBOUND_EMAIL_ADAPTER = void 0;
/** DI token the inbound-email controller resolves its adapter through. */
exports.DOCS_INBOUND_EMAIL_ADAPTER = 'DOCS_INBOUND_EMAIL_ADAPTER';
/** DI token for {@link IInboundAddressResolver}. */
exports.DOCS_INBOUND_ADDRESS_RESOLVER = 'DOCS_INBOUND_ADDRESS_RESOLVER';
//# sourceMappingURL=inbound-email.types.js.map