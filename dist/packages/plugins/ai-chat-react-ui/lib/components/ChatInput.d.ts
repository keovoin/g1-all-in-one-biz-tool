import { type ChatTranslate } from '../use-chat-translate';
/**
 * A failed transcription, with the server's machine-readable reason.
 *
 * `POST /api/ai-chat/transcribe` answers 503 with `{ message, code, settingsPath }` where `code`
 * is an `AiSpeechErrorCode` (`AI_SPEECH_NOT_CONFIGURED` / `AI_SPEECH_KEY_REJECTED` /
 * `AI_SPEECH_FAILED`). The panel's `onTranscribe` throws this so the input can render a
 * translated, actionable message with a link to the AI Providers page; a plain `Error` (network,
 * old server) keeps the message-only path.
 */
export declare class DictationError extends Error {
    readonly name = "DictationError";
    /** `AiSpeechErrorCode` string, when the server sent one. */
    readonly code?: string;
    /** Where the problem is fixed (`/pages/settings/ai`), when the server sent it. */
    readonly settingsPath?: string;
    /** HTTP status of the failed response. */
    readonly status?: number;
    constructor(message: string, details?: {
        code?: string;
        settingsPath?: string;
        status?: number;
    });
}
export interface ChatInputProps {
    value: string;
    /** True while a response is being generated (submit disabled, stop shown). */
    isBusy: boolean;
    /** `t(key, fallback)` from the panel — see `useChatTranslate`. */
    translate?: ChatTranslate;
    onChange: (value: string) => void;
    /**
     * Send the message. Dictation passes the transcript EXPLICITLY, because `onChange` is
     * asynchronous and the parent would otherwise submit its pre-dictation state.
     */
    onSubmit: (text?: string) => void;
    onStop: () => void;
    /** Called when the user presses Escape (collapse the sidebar). */
    onEscape?: () => void;
    /**
     * Send recorded audio for transcription and resolve with the text.
     *
     * The microphone button is hidden entirely when this is absent, rather than shown and then
     * failing on click: a control that cannot work should not be offered.
     */
    onTranscribe?: (audio: Blob) => Promise<string>;
    /**
     * Open the AI Providers settings page (`settingsPath`, default `/pages/settings/ai`).
     *
     * Supplied ONLY when the user may actually go there (`AI_CHAT_SETTINGS`): with it, a dictation
     * failure caused by configuration shows an "Open AI Providers" action; without it, the message
     * tells the user to ask an administrator. A link that bounces to the settings index is worse
     * than no link.
     */
    onOpenAiSettings?: (settingsPath?: string) => void;
    /**
     * Upload a file the user picked and attach it to this conversation.
     *
     * Absent ⇒ the paperclip stays the inert "coming soon" affordance it has always been. Same
     * rule as `onTranscribe`: a control that cannot work is never offered as if it could.
     */
    onAttachFile?: (file: File) => Promise<void>;
    /** Open the "attach from Documents" picker. Absent ⇒ the library button stays inert. */
    onAttachFromDocuments?: () => void;
    /** True while an attachment upload is in flight (both attach controls are disabled). */
    isAttaching?: boolean;
    /**
     * Identifies what the input is composing FOR — the active conversation.
     *
     * A take that outlives its conversation must not be delivered: switching chats while speaking, or
     * while the transcript is still in flight, would otherwise drop the words into whichever
     * conversation happens to be open when they arrive.
     */
    composingFor?: string;
}
/**
 * ChatInput
 *
 * Compact input area for the inline sidebar chat. Features:
 * - Auto-resizing textarea (up to 3 lines)
 * - Enter to send, Shift+Enter for newline, Escape to collapse
 * - Send / Stop button depending on generation state
 * - Attach, library and dictation controls on the leading edge
 *
 * Controlled component — `useChat` from @ai-sdk/react v4 (AI SDK 7)
 * does not manage input state, so the parent owns `value`.
 */
export declare function ChatInput({ value, isBusy, translate: t, onChange, onSubmit, onStop, onEscape, onTranscribe, onOpenAiSettings, onAttachFile, onAttachFromDocuments, isAttaching, composingFor }: ChatInputProps): import("react/jsx-runtime").JSX.Element;
