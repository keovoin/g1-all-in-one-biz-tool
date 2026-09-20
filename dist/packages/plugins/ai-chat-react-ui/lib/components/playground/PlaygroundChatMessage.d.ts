import { type ReactNode } from 'react';
import type { UIMessage } from 'ai';
export interface PlaygroundChatMessageProps {
    /** UI message (AI SDK 7) whose `parts` are rendered. */
    message: UIMessage;
    /** True while this (assistant) message is still streaming in. */
    isStreaming?: boolean;
    /** Custom avatar node (defaults to "U" / "AI" initials). */
    avatar?: ReactNode;
    /** Respond to a pending tool approval request. */
    onApprovalResponse?: (approvalId: string, approved: boolean) => void;
}
/**
 * PlaygroundChatMessage — a single message for user or assistant in the
 * playground chat panel, rendered from the message `parts`:
 * - text parts → markdown bubbles (assistant) / plain bubbles (user)
 * - tool parts (`tool-*` / `dynamic-tool`) → {@link ToolCallCard} chips
 *
 * User messages are right-aligned, assistant messages left-aligned.
 */
export declare function PlaygroundChatMessage({ message, isStreaming, avatar, onApprovalResponse }: PlaygroundChatMessageProps): import("react/jsx-runtime").JSX.Element;
