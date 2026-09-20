export interface ChatToggleBarProps {
    isExpanded: boolean;
    onToggle: () => void;
    onNewChat: () => void;
    messageCount?: number;
}
/**
 * ChatToggleBar
 *
 * Collapsible header bar for the AI Chat widget, rendered inline
 * inside the left sidebar. When collapsed it shows a compact
 * "AI Chat" label with a badge count; when expanded it also
 * surfaces a "New conversation" action icon.
 */
export declare function ChatToggleBar({ isExpanded, onToggle, onNewChat, messageCount }: ChatToggleBarProps): import("react/jsx-runtime").JSX.Element;
