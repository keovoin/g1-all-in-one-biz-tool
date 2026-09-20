import { type ChatTranslate } from '../use-chat-translate';
/** One conversation row as returned by GET /api/ai-chat/conversations. */
export interface IChatHistoryItem {
    id: string;
    title: string;
    updatedAt: string;
}
export interface ChatHistoryPanelProps {
    items: IChatHistoryItem[];
    loading: boolean;
    activeId?: string;
    /** `t(key, fallback)` from the panel — see `useChatTranslate`. */
    translate?: ChatTranslate;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}
/**
 * ChatHistoryPanel
 *
 * Overlay list of the user's saved conversations (server-side history,
 * scoped to the current user + tenant). Click to resume, trash to delete.
 */
export declare function ChatHistoryPanel({ items, loading, activeId, translate: t, onSelect, onDelete, onClose }: ChatHistoryPanelProps): import("react/jsx-runtime").JSX.Element;
