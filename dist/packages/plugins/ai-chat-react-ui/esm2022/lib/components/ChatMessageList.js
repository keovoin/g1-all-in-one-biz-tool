import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import { ChatMessageItem } from './ChatMessageItem';
import { chatTheme } from '../chat-theme';
/**
 * ChatMessageList
 *
 * Scrollable container for chat messages. Auto-scrolls to
 * the bottom when new content streams in. Compact layout
 * optimised for the narrow sidebar width.
 */
export function ChatMessageList({ messages, status, onApprovalResponse, onOpenCitation, translate }) {
    const scrollRef = useRef(null);
    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages, status]);
    const containerStyle = {
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '14px 12px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        // Wide streamed content must never stretch the panel's flex column.
        minWidth: 0
    };
    const lastMessage = messages[messages.length - 1];
    const isStreaming = status === 'streaming';
    return (_jsxs("div", { ref: scrollRef, style: containerStyle, className: "gz-ai-chat-scroll", children: [messages.map((message) => (_jsx(ChatMessageItem, { message: message, isStreaming: isStreaming && message === lastMessage && message.role === 'assistant', onApprovalResponse: onApprovalResponse, onOpenCitation: onOpenCitation, translate: translate }, message.id))), status === 'submitted' && lastMessage?.role === 'user' && _jsx(TypingIndicator, {})] }));
}
// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
    const bubbleStyle = {
        backgroundColor: chatTheme.assistantBubbleBg,
        border: `1px solid ${chatTheme.borderSoft}`,
        borderRadius: `${chatTheme.bubbleRadius} ${chatTheme.bubbleRadius} ${chatTheme.bubbleRadius} ${chatTheme.bubbleRadiusTight}`,
        padding: '9px 13px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        animation: 'fadeIn 0.2s ease'
    };
    const dotBase = {
        width: 5,
        height: 5,
        borderRadius: '50%',
        backgroundColor: chatTheme.textSecondary
    };
    return (_jsx("div", { children: _jsxs("div", { style: bubbleStyle, children: [_jsx("span", { style: { ...dotBase, animation: 'typingDot 1.4s ease-in-out infinite' } }), _jsx("span", { style: { ...dotBase, animation: 'typingDot 1.4s ease-in-out 0.2s infinite' } }), _jsx("span", { style: { ...dotBase, animation: 'typingDot 1.4s ease-in-out 0.4s infinite' } })] }) }));
}
//# sourceMappingURL=ChatMessageList.js.map