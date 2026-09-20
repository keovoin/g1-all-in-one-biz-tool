/**
 * AiChatConversationModule
 *
 * Persistence + REST endpoints for per-user AI chat conversation history.
 * Exports {@link AiChatConversationService} for the chat engine (which
 * calls `saveTurn` from stream-finished callbacks with an explicit
 * tenant/user scope — see the service JSDoc).
 */
export declare class AiChatConversationModule {
}
