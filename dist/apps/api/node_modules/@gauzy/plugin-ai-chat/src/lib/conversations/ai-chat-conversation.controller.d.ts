import { ID } from '@gauzy/contracts';
import { AiChatConversationService } from './ai-chat-conversation.service';
/**
 * Per-user AI chat conversation history endpoints.
 *
 * All routes require the `AI_CHAT_ACCESS` permission (every chat user
 * manages their OWN history — no admin permission needed) and operate
 * strictly on `RequestContext.currentUserId()`: a user can only ever
 * list, read, or delete conversations they own, within their tenant.
 */
export declare class AiChatConversationController {
    private readonly aiChatConversationService;
    constructor(aiChatConversationService: AiChatConversationService);
    /**
     * List the current user's conversations (newest first). Transcripts are
     * not included — only id, title, and last-update time.
     *
     * @returns Conversation summaries for the current user.
     */
    findAll(): Promise<Array<{
        id: string;
        title: string;
        updatedAt: Date;
    }>>;
    /**
     * Load one of the current user's conversations, including the parsed
     * message transcript.
     *
     * @param id - The UUID of the conversation to load.
     * @returns The conversation with its parsed `UIMessage[]` transcript.
     */
    findById(id: ID): Promise<{
        id: string;
        title: string;
        messages: unknown[];
    }>;
    /**
     * Delete one of the current user's conversations.
     *
     * @param id - The UUID of the conversation to delete.
     */
    delete(id: ID): Promise<void>;
}
