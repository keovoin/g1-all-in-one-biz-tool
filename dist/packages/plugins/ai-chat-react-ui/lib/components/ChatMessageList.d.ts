import type { UIMessage } from 'ai';
import type { IDocsCitation } from './DocsCitationChips';
export interface ChatMessageListProps {
    messages: UIMessage[];
    /** Chat status from useChat: 'submitted' | 'streaming' | 'ready' | 'error'. */
    status: string;
    /** Respond to a pending tool approval request. */
    onApprovalResponse?: (approvalId: string, approved: boolean) => void;
    /** Open a document citation chip (router navigation supplied by the panel). */
    onOpenCitation?: (citation: IDocsCitation) => void;
    /** `t(key, fallback)` from the panel. */
    translate?: (key: string, fallback: string) => string;
}
/**
 * ChatMessageList
 *
 * Scrollable container for chat messages. Auto-scrolls to
 * the bottom when new content streams in. Compact layout
 * optimised for the narrow sidebar width.
 */
export declare function ChatMessageList({ messages, status, onApprovalResponse, onOpenCitation, translate }: ChatMessageListProps): import("react/jsx-runtime").JSX.Element;
