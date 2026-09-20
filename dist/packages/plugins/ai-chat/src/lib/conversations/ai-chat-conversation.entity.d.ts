import { TenantOrganizationBaseEntity } from '@gauzy/core';
/**
 * A persisted AI chat conversation for a single user.
 *
 * One row per conversation thread. Rows are scoped by tenant/organization
 * (via {@link TenantOrganizationBaseEntity}) AND by the owning `userId` —
 * a conversation is private to the user who created it, even within the
 * same tenant. `createdAt`/`updatedAt` come from the base entity.
 */
export declare class AiChatConversation extends TenantOrganizationBaseEntity {
    /**
     * Id of the user who owns this conversation. Stored as a plain indexed
     * column (no FK relation object — same pattern as `providerId` on the
     * BYOK credential entity). Every read/write MUST filter on this column
     * in addition to the tenant scope.
     */
    userId: string;
    /**
     * Human-readable conversation title (derived from the first user message
     * when not provided explicitly; max 60 characters by convention).
     */
    title: string;
    /**
     * JSON-serialized Vercel AI SDK `UIMessage[]` transcript of the
     * conversation. The raw column value is always a JSON string —
     * (de)serialization happens exclusively in {@link AiChatConversationService}
     * (`saveTurn` serializes, `getForUser` parses); consumers never read
     * this column directly.
     */
    messages: string;
}
