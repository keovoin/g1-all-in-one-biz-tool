import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ID } from '@gauzy/contracts';
import { EventBus } from '@gauzy/core';
import { Document } from '../entities/document.entity';
import { TypeOrmDocumentRepository } from '../repositories/type-orm-document.repository';
import { DocumentProcessingService } from '../services/document-processing.service';
/**
 * The event class name this subscriber binds to when the chat plugin exports it
 * (`07-ai-knowledge.md` §17.1). Kept as a string so a missing export is a *runtime*
 * feature-detection miss, not a compile error.
 */
export declare const AI_CHAT_ATTACHMENT_EVENT = "AiChatAttachmentSavedEvent";
/**
 * The payload contract this plugin consumes (§17.1):
 * `{ tenantId, organizationId, userId, conversationId, file }`.
 */
export interface IAiChatAttachmentSavedPayload {
    tenantId: ID;
    organizationId: ID;
    userId?: ID;
    conversationId?: ID;
    file: {
        key?: string;
        originalname?: string;
        filename?: string;
        mimetype?: string;
        size?: number;
    };
}
/**
 * Chat capture (`07-ai-knowledge.md` §17.1).
 *
 * `@gauzy/plugin-ai-chat` is expected to publish `AiChatAttachmentSavedEvent` on the core
 * RxJS event bus when a user attaches a file to a conversation. This plugin subscribes and
 * turns that file into an ordinary `Document { kind: FILE, source: CHAT }` that then rides
 * the standard pipeline unchanged.
 *
 * **The chat plugin does not emit that event yet.** Adding attachment upload is its own M5
 * work item, and the event contract above is what this plugin consumes. Rather than ship a
 * dangling TODO, this subscriber **feature-detects the event class at runtime**:
 *
 * - the class IS exported ⇒ a live subscription is created and attachments are captured;
 * - the class is NOT exported (today) ⇒ a **registered no-op subscriber** stays in place,
 *   logs one debug line at bootstrap, and does nothing else. The seam is wired, so the day
 *   the chat plugin starts exporting + publishing the event, capture begins with **zero**
 *   changes on this side.
 *
 * Captured documents land as `source: CHAT`, `reviewStatus: PENDING` (`reason: manual`) and
 * `knowledgeStatus: NONE` — like every other capture channel, they are never auto-imported
 * into the AI knowledge base.
 */
export declare class ChatCaptureSubscriber implements OnModuleInit, OnModuleDestroy {
    private readonly eventBus;
    private readonly typeOrmDocumentRepository;
    private readonly processingService;
    private readonly logger;
    /** Live when the chat plugin exports the event class; undefined in the no-op case. */
    private subscription?;
    constructor(eventBus: EventBus, typeOrmDocumentRepository: TypeOrmDocumentRepository, processingService: DocumentProcessingService);
    /** Whether a live subscription was established (as opposed to the no-op fallback). */
    get isActive(): boolean;
    /**
     * Feature-detects the chat attachment event and subscribes when it exists.
     */
    onModuleInit(): void;
    /** Drops the subscription on teardown (no-op when it was never established). */
    onModuleDestroy(): void;
    /**
     * Turns one saved chat attachment into a `Document { kind: FILE, source: CHAT }`.
     *
     * Runs off the request path (event bus), so the tenant/organization scope comes from the
     * event payload — `RequestContext` is never consulted.
     *
     * @param payload The attachment-saved payload.
     */
    captureAttachment(payload: IAiChatAttachmentSavedPayload): Promise<Document | null>;
    /**
     * Runtime feature detection of the chat attachment event class.
     *
     * @returns The event constructor when the chat plugin exports it, else undefined.
     */
    private resolveAttachmentEventClass;
}
