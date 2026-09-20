import { TenantAwareCrudService } from '@gauzy/core';
import { AiChatConversation } from './ai-chat-conversation.entity';
import { MikroOrmAiChatConversationRepository } from './repositories/mikro-orm-ai-chat-conversation.repository';
import { TypeOrmAiChatConversationRepository } from './repositories/type-orm-ai-chat-conversation.repository';
/**
 * AiChatConversationService
 *
 * Persistence for per-user AI chat conversations. The `messages` column
 * stores a JSON-serialized Vercel AI SDK `UIMessage[]`; this service owns
 * both serialization (`saveTurn`) and parsing (`getForUser`).
 *
 * SECURITY / CONTEXT NOTE: every method takes an EXPLICIT `tenantId` and
 * `userId` and builds explicit where-clauses from them, instead of relying
 * on `TenantAwareCrudService`'s automatic `RequestContext`-based tenant
 * scoping. This is deliberate: `saveTurn` is invoked from stream-finished
 * callbacks AFTER the HTTP request context (CLS) is gone — in that state
 * `RequestContext.currentUser()` is `null` and the inherited CRUD methods
 * would silently apply NO tenant filter at all (and `create()` would set
 * `tenantId` to `undefined`). All reads/writes therefore go through the
 * raw TypeORM repository with `{ tenantId, userId }` conditions, and each
 * method rejects empty scope arguments so a missing value can never widen
 * a where-clause. A user can never read, overwrite, or delete another
 * user's conversation — even within the same tenant.
 */
export declare class AiChatConversationService extends TenantAwareCrudService<AiChatConversation> {
    readonly typeOrmAiChatConversationRepository: TypeOrmAiChatConversationRepository;
    readonly mikroOrmAiChatConversationRepository: MikroOrmAiChatConversationRepository;
    constructor(typeOrmAiChatConversationRepository: TypeOrmAiChatConversationRepository, mikroOrmAiChatConversationRepository: MikroOrmAiChatConversationRepository);
    /**
     * List a user's conversations in the given tenant, newest first.
     * The (potentially large) `messages` column is intentionally NOT selected.
     *
     * @param userId - The owning user id (explicit — never taken from ambient context).
     * @param tenantId - The tenant to scope the query to (explicit — see class JSDoc).
     * @param take - Maximum number of conversations to return (default 50).
     * @returns Lightweight conversation summaries ordered by `updatedAt` descending.
     */
    listForUser(userId: string, tenantId: string, take?: number): Promise<Array<{
        id: string;
        title: string;
        updatedAt: Date;
    }>>;
    /**
     * Load a single conversation owned by the user in the given tenant,
     * with the transcript parsed back into a `UIMessage[]`.
     *
     * Returns `null` both when the conversation does not exist AND when it
     * belongs to another user/tenant — callers cannot distinguish the two
     * cases (no "exists but not yours" oracle).
     *
     * @param id - The conversation id.
     * @param userId - The owning user id (explicit).
     * @param tenantId - The tenant to scope the lookup to (explicit).
     * @returns The conversation with parsed messages, or `null`.
     */
    getForUser(id: string, userId: string, tenantId: string): Promise<{
        id: string;
        title: string;
        messages: unknown[];
    } | null>;
    /**
     * Upsert a conversation turn (called by the chat engine when a stream finishes —
     * potentially OUTSIDE the HTTP request context, hence the explicit `tenantId`).
     *
     * Behavior:
     * - When `conversationId` refers to a conversation owned by (`tenantId`, `userId`),
     *   its transcript is replaced (and `updatedAt` bumps via `save`).
     * - Otherwise a NEW row is created. A caller-provided `conversationId` is used as
     *   the row id only when it is a valid UUID AND not already taken by any other row
     *   (including soft-deleted ones) — an id collision with a row the user does not
     *   own falls back to a DB-generated id, so a hostile id can never overwrite
     *   someone else's conversation.
     * - Title: `input.title` when provided, else derived from the first user
     *   message's first text part (trimmed to 60 chars), else 'New conversation'.
     *
     * @param input - The turn payload (explicit tenant/user scope + full `UIMessage[]`).
     * @returns The id of the created or updated conversation.
     */
    saveTurn(input: {
        conversationId?: string;
        userId: string;
        tenantId: string;
        organizationId?: string;
        title?: string;
        messages: unknown[];
    }): Promise<{
        id: string;
    }>;
    /**
     * Delete a conversation, but only when it is owned by the user in the
     * given tenant. The scoped delete criteria make it impossible to remove
     * another user's row regardless of the id supplied.
     *
     * @param id - The conversation id.
     * @param userId - The owning user id (explicit).
     * @param tenantId - The tenant to scope the delete to (explicit).
     * @returns `true` when a row was deleted, `false` otherwise (not found or not owned).
     */
    deleteForUser(id: string, userId: string, tenantId: string): Promise<boolean>;
    /**
     * Derive a conversation title from a `UIMessage[]`: the first `user`
     * message's first non-empty text part, whitespace-collapsed and trimmed
     * to {@link TITLE_MAX_LENGTH} characters. Falls back to
     * {@link DEFAULT_TITLE} when no user text exists.
     *
     * @param messages - The (unserialized) message array from the chat engine.
     * @returns The derived title.
     */
    private deriveTitle;
}
