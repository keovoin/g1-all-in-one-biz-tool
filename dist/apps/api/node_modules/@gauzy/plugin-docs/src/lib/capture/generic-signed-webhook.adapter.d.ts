import { IInboundEmailAdapter, IInboundWebhookRequest, ParsedInboundEmail } from './inbound-email.types';
export declare class GenericSignedWebhookAdapter implements IInboundEmailAdapter {
    readonly id = "generic-signed-webhook";
    private readonly logger;
    /**
     * Signatures already accepted, mapped to the epoch-ms instant at which they may be
     * forgotten (the end of their own freshness window). A `Map` keeps insertion order,
     * which is what the entry-cap eviction uses.
     */
    private readonly seenSignatures;
    /**
     * Verifies the HMAC signature, the freshness window, and single use.
     *
     * NOTE: a successful call has the side effect of consuming the signature — calling it
     * twice for the same delivery returns `false` the second time, by design.
     *
     * @param request The inbound webhook request.
     * @returns True when the request is authentic, fresh, and not a replay.
     */
    verifySignature(request: IInboundWebhookRequest): boolean;
    /**
     * Normalizes the generic payload shape into the canonical message.
     *
     * Expected body (all fields optional except `recipient`):
     *
     * ```jsonc
     * {
     *   "recipient": "docs-<token>@example.com",
     *   "sender": "someone@example.com",
     *   "subject": "Invoice 42",
     *   "messageId": "<abc@mail>",
     *   "sizeBytes": 91234,
     *   "spf": "pass", "dkim": "pass",
     *   "attachments": [ { "fileName": "invoice.pdf", "contentType": "application/pdf",
     *                      "content": "<base64>" } ]
     * }
     * ```
     *
     * @param request The verified webhook request.
     * @returns The normalized inbound message.
     */
    parse(request: IInboundWebhookRequest): ParsedInboundEmail;
    /**
     * Reads one header value case-insensitively (headers may arrive as arrays).
     */
    private header;
    /**
     * The exact received bytes when available, else the canonical JSON re-serialization.
     */
    private rawBody;
    /**
     * Single-use guard: records a verified signature and reports whether it is new.
     *
     * Expired entries are pruned on every call, so the set never holds more than one
     * freshness window of traffic; the entry cap is the backstop for a pathological burst.
     *
     * @param key The `<timestamp>.<signature>` pair identifying one delivery.
     * @param signedAt The delivery's own timestamp, in epoch ms.
     * @returns True when the signature had not been seen (i.e. the request may proceed).
     */
    private consumeSignature;
    /**
     * Parses a webhook timestamp header into epoch milliseconds.
     *
     * @param timestamp The raw header value (Unix seconds or milliseconds).
     * @returns Epoch ms, or null when the value is not a usable timestamp.
     */
    private timestampMillis;
    /**
     * Length-checked constant-time comparison of two hex digests.
     */
    private constantTimeEquals;
    /**
     * Decodes an attachment payload (base64 by default; `utf8`/`text` for inline text).
     */
    private decodeContent;
    /**
     * Normalizes an SPF/DKIM verdict field (`"pass"` / boolean / undefined).
     */
    private verdict;
}
