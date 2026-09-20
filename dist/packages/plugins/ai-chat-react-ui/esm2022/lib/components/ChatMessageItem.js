import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { MarkdownContent } from './MarkdownContent';
import { ToolCallCard } from './ToolCallCard';
import { DocsCitationChips, DOCS_CITATIONS_PART_TYPE } from './DocsCitationChips';
import { parseAttachmentPreamble } from './attachment-preamble';
import { chatTheme } from '../chat-theme';
/**
 * The attachment chips shown on a USER message in place of the raw preamble text.
 *
 * A chip with a `documentId` deep-links into the Documents hub through the same bridge the
 * assistant's citation chips use — and through the same shape (`IDocsCitation` is `{documentId,
 * url, …}`), so the panel's existing `onOpenCitation` handler serves both. A name-only chip
 * (Documents unavailable on this install) has nowhere to link and renders inert.
 */
function UserAttachmentChips({ attachments, onOpen, translate }) {
    const t = translate ?? ((_key, fallback) => fallback);
    const chipStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        maxWidth: '100%',
        padding: '3px 8px',
        borderRadius: 999,
        border: '1px solid rgba(255, 255, 255, 0.28)',
        backgroundColor: 'rgba(255, 255, 255, 0.14)',
        color: 'inherit',
        fontSize: chatTheme.fontSizeMessage,
        fontWeight: chatTheme.fontWeightMedium,
        lineHeight: 1.5,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    };
    return (_jsx("span", { style: { display: 'flex', flexWrap: 'wrap', gap: 4 }, children: attachments.map((attachment, chipIndex) => attachment.documentId && onOpen ? (_jsxs("button", { type: "button", className: "gz-ai-chat-user-chip", style: {
                ...chipStyle,
                cursor: 'pointer',
                font: 'inherit',
                fontSize: chatTheme.fontSizeMessage,
                fontWeight: chatTheme.fontWeightMedium
            }, title: attachment.name, "aria-label": t('AI_ASSISTANT.ATTACH_OPEN', 'Open attached document') + `: ${attachment.name}`, onClick: () => onOpen({
                documentId: attachment.documentId,
                // Same deep-link split the server's citation chips use: a PAGE opens
                // at its editor route, everything else in the file browser.
                url: attachment.kind === 'PAGE'
                    ? `/pages/documents/page/${attachment.documentId}`
                    : `/pages/documents?id=${attachment.documentId}`,
                name: attachment.name
            }), children: ["\uD83D\uDCCE ", attachment.name] }, `${attachment.documentId}-${chipIndex}`)) : (_jsxs("span", { style: chipStyle, title: attachment.name, children: ["\uD83D\uDCCE ", attachment.name] }, `${attachment.name}-${chipIndex}`))) }));
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
export function ChatMessageItem({ message, isStreaming, onApprovalResponse, onOpenCitation, translate }) {
    const isUser = message.role === 'user';
    const rowStyle = {
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        animation: 'fadeIn 0.2s ease'
    };
    const bubbleStyle = {
        maxWidth: isUser ? '88%' : '96%',
        minWidth: 0,
        padding: isUser ? '7px 11px' : '8px 11px',
        borderRadius: isUser
            ? `${chatTheme.bubbleRadius} ${chatTheme.bubbleRadius} ${chatTheme.bubbleRadiusTight} ${chatTheme.bubbleRadius}`
            : `${chatTheme.bubbleRadius} ${chatTheme.bubbleRadius} ${chatTheme.bubbleRadius} ${chatTheme.bubbleRadiusTight}`,
        backgroundColor: isUser ? chatTheme.userBubbleBg : chatTheme.assistantBubbleBg,
        // The assistant bubble is a quiet surface, so a hairline is what gives it an edge
        // against the panel; the user bubble already has its own fill.
        border: isUser ? '1px solid transparent' : `1px solid ${chatTheme.borderSoft}`,
        color: isUser ? chatTheme.userBubbleText : chatTheme.assistantBubbleText,
        fontSize: chatTheme.fontSizeMessage,
        lineHeight: chatTheme.lineHeightMessage,
        letterSpacing: '0.01em',
        wordBreak: 'break-word'
    };
    return (_jsx("div", { children: message.parts.map((part, index) => {
            if (part.type === 'text') {
                if (!part.text)
                    return null;
                // A user message that carries attachments starts with the preamble the panel
                // composed. The MODEL needs that text (it is what makes `docs_read` actionable
                // and keeps the attachment context alive across turns); the READER does not —
                // render chips + the user's own words instead. Display-only: the message text
                // is never altered.
                const attachmentView = isUser ? parseAttachmentPreamble(part.text) : null;
                if (attachmentView) {
                    return (_jsx("div", { style: rowStyle, children: _jsxs("div", { style: { ...bubbleStyle, display: 'flex', flexDirection: 'column', gap: 6 }, children: [_jsx(UserAttachmentChips, { attachments: attachmentView.attachments, ...(onOpenCitation ? { onOpen: onOpenCitation } : {}), ...(translate ? { translate } : {}) }), attachmentView.text ? (_jsx("span", { style: { whiteSpace: 'pre-wrap' }, children: attachmentView.text })) : null] }) }, `${message.id}-${index}`));
                }
                return (_jsx("div", { style: rowStyle, children: _jsx("div", { style: bubbleStyle, children: isUser ? (_jsx("span", { style: { whiteSpace: 'pre-wrap' }, children: part.text })) : (_jsx(MarkdownContent, { content: part.text, isStreaming: isStreaming })) }) }, `${message.id}-${index}`));
            }
            // Citation chips contributed by the Documents plugin. Rendered from the data
            // part, never from the tool result, so a chip always points at a document
            // retrieval really returned for THIS user.
            if (part.type === DOCS_CITATIONS_PART_TYPE) {
                const citationData = part.data;
                if (!citationData?.citations?.length)
                    return null;
                return (_jsx(DocsCitationChips, { data: citationData, ...(onOpenCitation ? { onOpen: onOpenCitation } : {}), ...(translate ? { translate } : {}) }, `${message.id}-${index}`));
            }
            if (part.type === 'dynamic-tool' || part.type.startsWith('tool-')) {
                const toolPart = part;
                const toolName = part.type === 'dynamic-tool' ? toolPart.toolName : part.type.slice(5);
                const approvalId = toolPart.approval?.id ?? toolPart.approvalId ?? toolPart.approval?.approvalId;
                return (_jsx(ToolCallCard, { toolName: toolName, state: toolPart.state, input: toolPart.input, output: toolPart.output, errorText: toolPart.errorText, ...(toolPart.state === 'approval-requested' && approvalId && onApprovalResponse
                        ? {
                            onApprove: () => onApprovalResponse(approvalId, true),
                            onReject: () => onApprovalResponse(approvalId, false)
                        }
                        : {}) }, `${message.id}-${index}`));
            }
            return null;
        }) }));
}
//# sourceMappingURL=ChatMessageItem.js.map