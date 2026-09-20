import { UploadedFile } from '@gauzy/contracts';
import { EventBus } from '@gauzy/core';
/**
 * Largest chat attachment accepted.
 *
 * Exported so the route can declare the SAME cap as a multer `limits` — one constant, two
 * enforcement points that cannot drift, exactly as `MAX_AUDIO_BYTES` does for dictation.
 */
export declare const MAX_ATTACHMENT_BYTES: number;
/** What the client gets back for one saved attachment. */
export interface IAiChatAttachmentResult {
    /** Storage key of the stored object. */
    key: string;
    /** The client's filename, as stored. */
    name: string;
    /** The client-declared MIME (advisory — consumers sniff the bytes). */
    mimeType?: string;
    /** Stored size in bytes. */
    size?: number;
}
/**
 * AiChatAttachmentService
 *
 * Saves a file a user attached to a chat conversation and announces it on the core event bus as
 * {@link AiChatAttachmentSavedEvent}.
 *
 * The bytes have already been streamed into the configured `FileStorage` provider by the route's
 * interceptor, so this service never touches file content — its whole job is to snapshot the
 * requesting scope while `RequestContext` is still live and publish the event.
 *
 * What happens NEXT is deliberately not this plugin's business: `@gauzy/plugin-docs` subscribes
 * to the event and turns the attachment into a `Document { kind: FILE, source: CHAT }` that rides
 * the standard extraction pipeline, after which the chat's own `docs_search` / `docs_read` tools
 * can read it. On an install without the docs plugin the event simply has no subscriber and the
 * file stays in storage.
 */
export declare class AiChatAttachmentService {
    private readonly eventBus;
    private readonly logger;
    constructor(eventBus: EventBus);
    /**
     * Records one saved attachment.
     *
     * @param file The uploaded file, already stored by the route's storage engine.
     * @param conversationId The conversation it was attached to, when the client sent one.
     * @returns The stored-object descriptor for the client.
     */
    save(file: UploadedFile, conversationId?: string): Promise<IAiChatAttachmentResult>;
    /**
     * Removes a stored object that will not be recorded (rejected upload). Best effort: a failure
     * to delete must not mask the rejection the caller is about to see.
     *
     * @param key The storage key of the object.
     */
    private discardStoredFile;
    /**
     * The requesting organization: the request context first, then the `Organization-Id` header
     * the web client sends on every call (the JWT itself carries no organization).
     */
    private resolveOrganizationId;
}
