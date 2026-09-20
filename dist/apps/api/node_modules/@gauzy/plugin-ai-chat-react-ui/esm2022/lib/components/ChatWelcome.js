import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { chatTheme } from '../chat-theme';
import { passthroughChatTranslate } from '../use-chat-translate';
/**
 * ChatWelcome
 *
 * Empty-state view shown when the conversation has no messages.
 * Compact layout for the narrow sidebar — shows a sparkle icon,
 * a short greeting, and a brief hint.
 */
export function ChatWelcome({ translate: t = passthroughChatTranslate }) {
    const containerStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        textAlign: 'center',
        gap: 12
    };
    const iconContainerStyle = {
        width: 46,
        height: 46,
        borderRadius: '50%',
        backgroundColor: chatTheme.accentLight,
        border: `1px solid ${chatTheme.borderSoft}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: chatTheme.accent,
        marginBottom: 2
    };
    const titleStyle = {
        fontSize: chatTheme.fontSizeLarge,
        fontWeight: chatTheme.fontWeightSemibold,
        letterSpacing: '-0.005em',
        color: chatTheme.textPrimary,
        margin: 0
    };
    const subtitleStyle = {
        fontSize: chatTheme.fontSizeSmall,
        color: chatTheme.textSecondary,
        margin: 0,
        maxWidth: 260,
        lineHeight: 1.65
    };
    return (_jsxs("div", { style: containerStyle, children: [_jsx("div", { style: iconContainerStyle, children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }) }) }), _jsx("h3", { style: titleStyle, children: t('AI_ASSISTANT.TITLE', 'AI Assistant') }), _jsx("p", { style: subtitleStyle, children: t('AI_ASSISTANT.WELCOME_SUBTITLE', 'Ask anything about your workspace, tasks, or projects.') })] }));
}
//# sourceMappingURL=ChatWelcome.js.map