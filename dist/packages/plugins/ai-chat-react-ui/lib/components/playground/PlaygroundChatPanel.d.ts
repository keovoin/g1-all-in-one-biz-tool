import { type ReactNode } from 'react';
import type { ChatStatus, UIMessage } from 'ai';
export interface PlaygroundChatPanelProps {
    /** UI messages (AI SDK 7) to render. */
    messages: UIMessage[];
    /** Called when the user submits a message. */
    onSend: (message: string) => void;
    /** Chat status from `useChat` ('submitted' | 'streaming' | 'ready' | 'error'). */
    status?: ChatStatus;
    /** Error text shown in the error bar above the input. */
    error?: string;
    /** Retry the last request (shown next to the error). */
    onRetry?: () => void;
    /** Optional header content. */
    header?: ReactNode;
    /** Custom placeholder for the chat input. */
    inputPlaceholder?: string;
    /** Force-disable the input (e.g. while configuration loads). */
    disabled?: boolean;
    /** Respond to a pending tool approval request. */
    onApprovalResponse?: (approvalId: string, approved: boolean) => void;
}
/**
 * PlaygroundChatPanel — right-side chat area with message list,
 * empty-state illustration, loading indicator, error bar, and input bar.
 */
export declare function PlaygroundChatPanel({ messages, onSend, status, error, onRetry, header, inputPlaceholder, disabled, onApprovalResponse }: PlaygroundChatPanelProps): import("react/jsx-runtime").JSX.Element;
