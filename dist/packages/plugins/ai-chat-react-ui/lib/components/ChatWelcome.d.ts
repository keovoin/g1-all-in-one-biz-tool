import { type ChatTranslate } from '../use-chat-translate';
export interface ChatWelcomeProps {
    /** `t(key, fallback)` from the panel — see `useChatTranslate`. */
    translate?: ChatTranslate;
}
/**
 * ChatWelcome
 *
 * Empty-state view shown when the conversation has no messages.
 * Compact layout for the narrow sidebar — shows a sparkle icon,
 * a short greeting, and a brief hint.
 */
export declare function ChatWelcome({ translate: t }: ChatWelcomeProps): import("react/jsx-runtime").JSX.Element;
