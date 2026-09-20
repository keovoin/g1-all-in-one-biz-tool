import type { UIMessage } from 'ai';
import { type IDocsCitation } from './DocsCitationChips';
export interface ChatMessageItemProps {
    message: UIMessage;
    /** True while this (assistant) message is still streaming. */
    isStreaming?: boolean;
    /** Respond to a pending tool approval request. */
    onApprovalResponse?: (approvalId: string, approved: boolean) => void;
    /** Open a document citation chip (router navigation supplied by the panel). */
    onOpenCitation?: (citation: IDocsCitation) => void;
    /** `t(key, fallback)` from the panel. */
    translate?: (key: string, fallback: string) => string;
}
/**
 * ChatMessageItem
 *
 * Renders one UI message from its `parts`:
 * - text parts → markdown bubbles (user: accent right, assistant: subtle left)
 * - tool parts (`tool-*` / `dynamic-tool`) → compact ToolCallCard chips with
 *   live state, expandable details and Approve/Reject when the tool awaits
 *   the user's approval.
 * - `data-docs-citations` parts (contributed by @gauzy/plugin-docs) → clickable
 *   source chips deep-linking into the Documents hub.
 * Other part kinds (step markers, reasoning) are not rendered in the
 * compact sidebar view.
 */
export declare function ChatMessageItem({ message, isStreaming, onApprovalResponse, onOpenCitation, translate }: ChatMessageItemProps): import("react/jsx-runtime").JSX.Element;
