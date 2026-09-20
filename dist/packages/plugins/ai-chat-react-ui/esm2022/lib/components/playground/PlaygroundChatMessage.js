import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { playgroundTheme as t } from '../../playground-theme';
import { MarkdownContent } from '../MarkdownContent';
import { ToolCallCard } from '../ToolCallCard';
/**
 * PlaygroundChatMessage — a single message for user or assistant in the
 * playground chat panel, rendered from the message `parts`:
 * - text parts → markdown bubbles (assistant) / plain bubbles (user)
 * - tool parts (`tool-*` / `dynamic-tool`) → {@link ToolCallCard} chips
 *
 * User messages are right-aligned, assistant messages left-aligned.
 */
export function PlaygroundChatMessage({ message, isStreaming, avatar, onApprovalResponse }) {
    const isUser = message.role === 'user';
    const defaultInitial = isUser ? 'U' : 'AI';
    const containerStyle = {
        display: 'flex',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start'
    };
    const avatarStyle = {
        width: '1.75rem',
        height: '1.75rem',
        borderRadius: '50%',
        background: isUser ? t.accent : t.textSecondary,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: t.fontSizeXs,
        fontWeight: 700,
        flexShrink: 0,
        userSelect: 'none'
    };
    const columnStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        gap: '0.375rem',
        minWidth: 0,
        maxWidth: '80%'
    };
    const bubbleStyle = {
        padding: '0.625rem 0.875rem',
        borderRadius: t.radiusLg,
        background: isUser ? t.accent : t.bgInput,
        color: isUser ? '#fff' : t.textPrimary,
        fontSize: t.fontSizeBase,
        lineHeight: 1.55,
        wordBreak: 'break-word'
    };
    return (_jsxs("div", { style: containerStyle, children: [_jsx("div", { style: avatarStyle, children: avatar ?? defaultInitial }), _jsx("div", { style: columnStyle, children: message.parts.map((part, index) => {
                    if (part.type === 'text') {
                        if (!part.text)
                            return null;
                        return (_jsx("div", { style: bubbleStyle, children: isUser ? (_jsx("span", { style: { whiteSpace: 'pre-wrap' }, children: part.text })) : (_jsx(MarkdownContent, { content: part.text, isStreaming: isStreaming })) }, `${message.id}-${index}`));
                    }
                    if (part.type === 'dynamic-tool' || part.type.startsWith('tool-')) {
                        const toolPart = part;
                        const toolName = part.type === 'dynamic-tool' ? toolPart.toolName ?? 'tool' : part.type.slice(5);
                        const approvalId = toolPart.approval?.id ?? toolPart.approvalId ?? toolPart.approval?.approvalId;
                        return (_jsx("div", { style: { alignSelf: 'stretch' }, children: _jsx(ToolCallCard, { toolName: toolName, state: toolPart.state ?? '', input: toolPart.input, output: toolPart.output, errorText: toolPart.errorText, ...(toolPart.state === 'approval-requested' && approvalId && onApprovalResponse
                                    ? {
                                        onApprove: () => onApprovalResponse(approvalId, true),
                                        onReject: () => onApprovalResponse(approvalId, false)
                                    }
                                    : {}) }) }, `${message.id}-${index}`));
                    }
                    return null;
                }) })] }));
}
//# sourceMappingURL=PlaygroundChatMessage.js.map