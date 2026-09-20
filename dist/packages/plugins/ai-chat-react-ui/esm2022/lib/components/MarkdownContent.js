import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import { Streamdown } from 'streamdown';
import { chatTheme } from '../chat-theme';
function MarkdownListItem({ className, children, node: _node, ...props }) {
    const listItemClassName = className
        ?.split(/\s+/)
        .filter((className) => className !== 'py-1')
        .join(' ');
    return (_jsx("li", { ...props, className: listItemClassName || undefined, children: children }));
}
/**
 * MarkdownContent
 *
 * Markdown renderer for assistant messages, built on Vercel's
 * `streamdown` — a drop-in replacement for react-markdown designed for
 * AI streaming: it renders incomplete/unterminated markdown blocks
 * gracefully while tokens arrive, with GFM (tables, lists, task lists)
 * and hardened HTML handling out of the box.
 *
 * Styles come from `streamdown/styles.css` (loaded by the host app,
 * see apps/gauzy angular.json). Colors inherit from the chat theme.
 */
export const MarkdownContent = memo(function MarkdownContent({ content, isStreaming }) {
    const style = {
        fontSize: chatTheme.fontSizeMessage,
        lineHeight: chatTheme.lineHeightMessage,
        color: 'inherit',
        wordBreak: 'break-word'
    };
    return (_jsx("div", { style: style, className: "gz-ai-chat-markdown", children: _jsx(Streamdown, { mode: isStreaming ? 'streaming' : 'static', components: { li: MarkdownListItem }, children: content }) }));
});
//# sourceMappingURL=MarkdownContent.js.map