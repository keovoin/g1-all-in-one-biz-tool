import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import { playgroundTheme as t } from '../../playground-theme';
import { PlaygroundChatMessage } from './PlaygroundChatMessage';
import { PlaygroundChatInput } from './PlaygroundChatInput';
/**
 * PlaygroundChatPanel — right-side chat area with message list,
 * empty-state illustration, loading indicator, error bar, and input bar.
 */
export function PlaygroundChatPanel({ messages, onSend, status = 'ready', error, onRetry, header, inputPlaceholder, disabled = false, onApprovalResponse }) {
    const bottomRef = useRef(null);
    const isBusy = status === 'submitted' || status === 'streaming';
    // Waiting dots only before the first streamed token arrives.
    const showWaiting = status === 'submitted';
    const lastMessage = messages[messages.length - 1];
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, status]);
    const panelStyle = {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
        background: t.bg,
        borderLeft: `1px solid ${t.border}`
    };
    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderBottom: `1px solid ${t.border}`,
        fontWeight: 600,
        fontSize: t.fontSizeBase,
        color: t.textPrimary
    };
    const messagesStyle = {
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
    };
    const emptyStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: t.textHint,
        padding: '2rem'
    };
    const dotStyle = {
        width: '0.375rem',
        height: '0.375rem',
        borderRadius: '50%',
        background: t.textHint
    };
    const errorBarStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderTop: `1px solid ${t.border}`,
        background: 'rgba(255, 61, 113, 0.08)',
        color: t.red,
        fontSize: t.fontSizeSm
    };
    return (_jsxs("div", { style: panelStyle, children: [header && _jsx("div", { style: headerStyle, children: header }), _jsx("div", { style: messagesStyle, children: messages.length === 0 ? (_jsxs("div", { style: emptyStyle, children: [_jsx("svg", { style: { width: '3rem', height: '3rem', color: t.textHint, opacity: 0.5 }, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" }) }), _jsx("span", { style: { fontSize: t.fontSizeLg, fontWeight: 500 }, children: "Start a conversation" }), _jsx("span", { style: { fontSize: t.fontSizeSm }, children: "Send a message to begin chatting with the model." })] })) : (_jsxs(_Fragment, { children: [messages.map((message) => (_jsx(PlaygroundChatMessage, { message: message, isStreaming: status === 'streaming' && message === lastMessage && message.role === 'assistant', onApprovalResponse: onApprovalResponse }, message.id))), showWaiting && (_jsxs("div", { style: {
                                padding: '0.75rem 1rem',
                                display: 'flex',
                                gap: '0.25rem',
                                alignItems: 'center'
                            }, children: [_jsx("div", { style: { ...dotStyle, animation: 'pgPulse 1.4s ease-in-out infinite' } }), _jsx("div", { style: { ...dotStyle, animation: 'pgPulse 1.4s ease-in-out 0.2s infinite' } }), _jsx("div", { style: { ...dotStyle, animation: 'pgPulse 1.4s ease-in-out 0.4s infinite' } })] })), _jsx("div", { ref: bottomRef })] })) }), error && (_jsxs("div", { style: errorBarStyle, children: [_jsx("span", { children: "\u26A0" }), _jsx("span", { children: error }), onRetry && (_jsx("button", { type: "button", onClick: onRetry, style: {
                            background: 'none',
                            border: 'none',
                            color: t.accent,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: t.fontSizeSm,
                            fontFamily: t.font,
                            padding: 0
                        }, children: "Retry" }))] })), _jsx(PlaygroundChatInput, { onSend: onSend, disabled: disabled || isBusy, placeholder: inputPlaceholder })] }));
}
//# sourceMappingURL=PlaygroundChatPanel.js.map