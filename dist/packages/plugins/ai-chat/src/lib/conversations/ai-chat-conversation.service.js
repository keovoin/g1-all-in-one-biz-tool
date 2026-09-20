"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatConversationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const mikro_orm_ai_chat_conversation_repository_1 = require("./repositories/mikro-orm-ai-chat-conversation.repository");
const type_orm_ai_chat_conversation_repository_1 = require("./repositories/type-orm-ai-chat-conversation.repository");
/** Canonical UUID shape (any version) — used to validate caller-provided conversation ids. */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Maximum length of a derived (or provided) conversation title. */
const TITLE_MAX_LENGTH = 60;
/** Title used when no user text is available to derive one from. */
const DEFAULT_TITLE = 'New conversation';
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
let AiChatConversationService = class AiChatConversationService extends core_1.TenantAwareCrudService {
    constructor(typeOrmAiChatConversationRepository, mikroOrmAiChatConversationRepository) {
        super(typeOrmAiChatConversationRepository, mikroOrmAiChatConversationRepository);
        this.typeOrmAiChatConversationRepository = typeOrmAiChatConversationRepository;
        this.mikroOrmAiChatConversationRepository = mikroOrmAiChatConversationRepository;
    }
    /**
     * List a user's conversations in the given tenant, newest first.
     * The (potentially large) `messages` column is intentionally NOT selected.
     *
     * @param userId - The owning user id (explicit — never taken from ambient context).
     * @param tenantId - The tenant to scope the query to (explicit — see class JSDoc).
     * @param take - Maximum number of conversations to return (default 50).
     * @returns Lightweight conversation summaries ordered by `updatedAt` descending.
     */
    async listForUser(userId, tenantId, take = 50) {
        if (!userId || !tenantId) {
            return [];
        }
        const rows = await this.typeOrmAiChatConversationRepository.find({
            select: { id: true, title: true, updatedAt: true },
            where: { userId, tenantId },
            order: { updatedAt: 'DESC' },
            take
        });
        return rows.map(({ id, title, updatedAt }) => ({ id, title, updatedAt }));
    }
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
    async getForUser(id, userId, tenantId) {
        if (!id || !userId || !tenantId) {
            return null;
        }
        const record = await this.typeOrmAiChatConversationRepository.findOne({
            where: { id, userId, tenantId }
        });
        if (!record) {
            return null;
        }
        let messages = [];
        try {
            const parsed = JSON.parse(record.messages);
            messages = Array.isArray(parsed) ? parsed : [];
        }
        catch {
            // Corrupted/legacy payload — return an empty transcript rather than failing the read.
        }
        return { id: record.id, title: record.title, messages };
    }
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
    async saveTurn(input) {
        const { userId, tenantId, organizationId } = input;
        if (!userId || !tenantId) {
            throw new common_1.BadRequestException('A user id and tenant id are required to save a conversation.');
        }
        const serialized = JSON.stringify(Array.isArray(input.messages) ? input.messages : []);
        const providedTitle = input.title?.trim().slice(0, TITLE_MAX_LENGTH) || undefined;
        const conversationId = input.conversationId && UUID_REGEX.test(input.conversationId) ? input.conversationId : undefined;
        // Update path — only when the row exists AND is owned by (tenant, user).
        if (conversationId) {
            const existing = await this.typeOrmAiChatConversationRepository.findOne({
                where: { id: conversationId, userId, tenantId }
            });
            if (existing) {
                await this.typeOrmAiChatConversationRepository.save({
                    id: existing.id,
                    messages: serialized,
                    ...(providedTitle ? { title: providedTitle } : {})
                });
                return { id: existing.id };
            }
        }
        // Create path. Honor the provided id only when it is globally unused —
        // TypeORM `save` upserts by primary key, so persisting with an id that
        // belongs to another user/tenant would OVERWRITE their row. Checking
        // `withDeleted` also avoids PK collisions with soft-deleted rows.
        let id = conversationId;
        if (id) {
            const taken = await this.typeOrmAiChatConversationRepository.count({
                where: { id },
                withDeleted: true
            });
            if (taken > 0) {
                id = undefined;
            }
        }
        const created = await this.typeOrmAiChatConversationRepository.save(this.typeOrmAiChatConversationRepository.create({
            ...(id ? { id } : {}),
            tenantId,
            ...(organizationId ? { organizationId } : {}),
            userId,
            title: providedTitle ?? this.deriveTitle(input.messages),
            messages: serialized
        }));
        return { id: created.id };
    }
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
    async deleteForUser(id, userId, tenantId) {
        if (!id || !userId || !tenantId) {
            return false;
        }
        const result = await this.typeOrmAiChatConversationRepository.delete({
            id,
            userId,
            tenantId
        });
        return (result.affected ?? 0) > 0;
    }
    /**
     * Derive a conversation title from a `UIMessage[]`: the first `user`
     * message's first non-empty text part, whitespace-collapsed and trimmed
     * to {@link TITLE_MAX_LENGTH} characters. Falls back to
     * {@link DEFAULT_TITLE} when no user text exists.
     *
     * @param messages - The (unserialized) message array from the chat engine.
     * @returns The derived title.
     */
    deriveTitle(messages) {
        if (!Array.isArray(messages)) {
            return DEFAULT_TITLE;
        }
        const firstUserMessage = messages.find((message) => message?.role === 'user');
        if (!firstUserMessage || !Array.isArray(firstUserMessage.parts)) {
            return DEFAULT_TITLE;
        }
        for (const part of firstUserMessage.parts) {
            if (part?.type === 'text' && typeof part.text === 'string') {
                const text = part.text.replace(/\s+/g, ' ').trim();
                if (text) {
                    return text.length > TITLE_MAX_LENGTH ? text.slice(0, TITLE_MAX_LENGTH).trimEnd() : text;
                }
            }
        }
        return DEFAULT_TITLE;
    }
};
exports.AiChatConversationService = AiChatConversationService;
exports.AiChatConversationService = AiChatConversationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_ai_chat_conversation_repository_1.TypeOrmAiChatConversationRepository,
        mikro_orm_ai_chat_conversation_repository_1.MikroOrmAiChatConversationRepository])
], AiChatConversationService);
//# sourceMappingURL=ai-chat-conversation.service.js.map