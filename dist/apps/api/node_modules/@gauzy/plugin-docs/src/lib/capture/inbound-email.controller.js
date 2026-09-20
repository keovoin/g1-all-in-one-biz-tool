"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboundEmailController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const inbound_email_service_1 = require("./inbound-email.service");
/**
 * `POST /api/plugins/docs/inbound-email` — the provider-agnostic inbound-email capture
 * webhook (`07-ai-knowledge.md` §17.2).
 *
 * Why it is `@Public()`: an ESP has no Gauzy JWT. Authentication is the **webhook
 * signature** (verified by the bound adapter before anything else is read) plus the
 * **per-organization recipient token**, and the whole route is inert unless
 * `GAUZY_DOCS_INBOUND_EMAIL_ENABLED=true` — a disabled deployment answers 404 to every
 * call, so nothing is exposed by default.
 *
 * All gate ordering, size caps, attachments-only enforcement and the
 * `EMAIL` + `PENDING(manual)` + never-auto-indexed landing state live in
 * `InboundEmailService` — this controller only adapts Express to the transport-neutral
 * request shape the adapters consume.
 */
let InboundEmailController = class InboundEmailController {
    constructor(inboundEmailService) {
        this.inboundEmailService = inboundEmailService;
    }
    /**
     * Accepts one inbound message from the configured mail provider.
     */
    async receive(request, body) {
        const webhookRequest = {
            headers: (request?.headers ?? {}),
            body,
            // Present only when the HTTP layer preserves the raw payload; the reference
            // adapter documents the canonical-JSON fallback used when it is absent.
            rawBody: request?.rawBody
        };
        return this.inboundEmailService.handleWebhook(webhookRequest);
    }
};
exports.InboundEmailController = InboundEmailController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Inbound-email capture webhook (signed, per-organization token).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The message was processed (per-attachment results).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Invalid signature or failed SPF/DKIM.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Channel disabled or unknown capture address.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.PAYLOAD_TOO_LARGE, description: 'The message exceeded the inbound size cap.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/inbound-email'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InboundEmailController.prototype, "receive", null);
exports.InboundEmailController = InboundEmailController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_2.Public)(),
    (0, common_1.Controller)('/plugins/docs'),
    tslib_1.__metadata("design:paramtypes", [inbound_email_service_1.InboundEmailService])
], InboundEmailController);
//# sourceMappingURL=inbound-email.controller.js.map