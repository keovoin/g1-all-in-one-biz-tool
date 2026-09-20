import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { playgroundTheme as t } from '../../playground-theme';
/**
 * PlaygroundHeader — top bar with title and "New Chat" action button.
 */
export function PlaygroundHeader({ title = 'AI Playground', onNewChat, sidebarExpanded = true, onToggleSidebar }) {
    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: t.headerHeight,
        padding: '0 1rem',
        borderBottom: `1px solid ${t.border}`,
        background: t.bg,
        flexShrink: 0
    };
    const titleStyle = {
        fontSize: t.fontSizeLg,
        fontWeight: 700,
        color: t.textPrimary,
        letterSpacing: '-0.01em'
    };
    const newChatBtnStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.375rem 0.75rem',
        fontSize: t.fontSizeSm,
        fontWeight: 500,
        fontFamily: t.font,
        color: t.accent,
        background: t.accentSubtle,
        border: `1px solid ${t.accent}33`,
        borderRadius: t.radius,
        cursor: 'pointer',
        transition: `background ${t.transition}`
    };
    const toggleBtnStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2rem',
        height: '2rem',
        borderRadius: t.radius,
        border: `1px solid ${t.border}`,
        background: sidebarExpanded ? t.accentSubtle : 'transparent',
        color: sidebarExpanded ? t.accent : t.textSecondary,
        cursor: 'pointer',
        transition: `all ${t.transition}`,
        flexShrink: 0,
        padding: 0
    };
    return (_jsxs("header", { style: headerStyle, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [onToggleSidebar && (_jsx("button", { type: "button", style: toggleBtnStyle, onClick: onToggleSidebar, "aria-label": sidebarExpanded ? 'Collapse settings' : 'Expand settings', title: sidebarExpanded ? 'Collapse settings' : 'Expand settings', children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }), _jsx("line", { x1: "9", y1: "3", x2: "9", y2: "21" })] }) })), _jsx("span", { style: titleStyle, children: title })] }), onNewChat && (_jsxs("button", { type: "button", style: newChatBtnStyle, onClick: onNewChat, children: [_jsx("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "currentColor", children: _jsx("path", { d: "M8 2.5a.5.5 0 01.5.5v4.5H13a.5.5 0 010 1H8.5V13a.5.5 0 01-1 0V8.5H3a.5.5 0 010-1h4.5V3a.5.5 0 01.5-.5z" }) }), "New Chat"] }))] }));
}
//# sourceMappingURL=PlaygroundHeader.js.map