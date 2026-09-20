export interface PlaygroundChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}
/**
 * PlaygroundChatInput — textarea + send button at the bottom of the
 * playground chat panel. Supports Enter to send (Shift+Enter for newline).
 */
export declare function PlaygroundChatInput({ onSend, disabled, placeholder }: PlaygroundChatInputProps): import("react/jsx-runtime").JSX.Element;
