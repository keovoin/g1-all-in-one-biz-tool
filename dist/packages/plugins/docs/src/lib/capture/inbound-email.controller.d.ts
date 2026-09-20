import { IInboundEmailResponse, InboundEmailService } from './inbound-email.service';
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
export declare class InboundEmailController {
    private readonly inboundEmailService;
    constructor(inboundEmailService: InboundEmailService);
    /**
     * Accepts one inbound message from the configured mail provider.
     */
    receive(request: any, body: any): Promise<IInboundEmailResponse>;
}
