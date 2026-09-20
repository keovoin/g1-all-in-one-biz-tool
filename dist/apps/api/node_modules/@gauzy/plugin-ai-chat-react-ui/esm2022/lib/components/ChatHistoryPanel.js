import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { chatTheme } from '../chat-theme';
import { passthroughChatTranslate } from '../use-chat-translate';
/**
 * ChatHistoryPanel
 *
 * Overlay list of the user's saved conversations (server-side history,
 * scoped to the current user + tenant). Click to resume, trash to delete.
 */
export function ChatHistoryPanel({ items, loading, activeId, translate: t = passthroughChatTranslate, onSelect, onDelete, onClose }) {
    const containerStyle = {
        // Fills the chat BODY (the panel mounts this inside its position:relative body container),
        // so the panel's own header row stays visible and operable above it.
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 5,
        // `inherit` resolved to transparent (the parent paints no background), so the conversation
        // bled through. The layout publishes its sidebar surface as --gz-chat-surface; the blur is
        // the fallback for hosts that do not (detached window).
        backdropFilter: 'blur(12px)',
        background: 'var(--gz-chat-surface, transparent)'
    };
    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderBottom: `1px solid ${chatTheme.border}`,
        fontWeight: 600,
        fontSize: chatTheme.fontSizeBase,
        flexShrink: 0
    };
    const listStyle = {
        flex: 1,
        overflowY: 'auto',
        padding: 6
    };
    const rowStyle = (active) => ({
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        borderRadius: 8,
        backgroundColor: active ? chatTheme.accentLight : 'transparent'
    });
    const selectBtnStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flex: 1,
        minWidth: 0,
        padding: '8px 10px',
        borderRadius: 8,
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        color: 'inherit',
        fontSize: chatTheme.fontSizeBase
    };
    const deleteBtnStyle = {
        border: 'none',
        background: 'transparent',
        color: chatTheme.textHint,
        cursor: 'pointer',
        padding: 4,
        borderRadius: 4,
        flexShrink: 0
    };
    const closeBtnStyle = {
        marginLeft: 'auto',
        border: 'none',
        background: 'transparent',
        color: chatTheme.textSecondary,
        cursor: 'pointer',
        padding: 4,
        borderRadius: 6,
        lineHeight: 1
    };
    return (_jsxs("div", { style: containerStyle, children: [_jsxs("div", { style: headerStyle, children: [_jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0, opacity: 0.7 }, "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("polyline", { points: "12 6 12 12 16 14" })] }), _jsx("span", { children: t('AI_ASSISTANT.HISTORY', 'History') }), _jsx("button", { type: "button", className: "gz-ai-chat-head-btn", style: closeBtnStyle, onClick: onClose, title: t('AI_ASSISTANT.HISTORY_CLOSE', 'Close history'), "aria-label": t('AI_ASSISTANT.HISTORY_CLOSE', 'Close history'), children: "\u2715" })] }), _jsxs("div", { style: listStyle, children: [loading && (_jsx("div", { style: { padding: 12, color: chatTheme.textSecondary }, children: t('AI_ASSISTANT.LOADING', 'Loading…') })), !loading && items.length === 0 && (_jsx("div", { style: { padding: 12, color: chatTheme.textSecondary }, children: t('AI_ASSISTANT.HISTORY_EMPTY', 'No saved conversations yet.') })), items.map((item) => (_jsxs("div", { style: rowStyle(item.id === activeId), children: [_jsxs("button", { type: "button", style: selectBtnStyle, onClick: () => onSelect(item.id), children: [_jsx("span", { style: {
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            flex: 1
                                        }, children: item.title }), _jsx("span", { style: { color: chatTheme.textHint, fontSize: '0.625rem', flexShrink: 0 }, children: new Date(item.updatedAt).toLocaleDateString() })] }), _jsx("button", { type: "button", className: "gz-ai-chat-head-btn", style: deleteBtnStyle, title: t('AI_ASSISTANT.DELETE_CONVERSATION', 'Delete conversation'), "aria-label": `${t('AI_ASSISTANT.DELETE_CONVERSATION', 'Delete conversation')}: ${item.title}`, onClick: () => onDelete(item.id), children: _jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: [_jsx("polyline", { points: "3 6 5 6 21 6" }), _jsx("path", { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })] }) })] }, item.id)))] })] }));
}
//# sourceMappingURL=ChatHistoryPanel.js.map