import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from 'react';
import { chatTheme } from '../chat-theme';
import { passthroughChatTranslate } from '../use-chat-translate';
/** Send-button diameter. The action row is deliberately small — the message is the subject. */
const SEND_SIZE = 26;
/** The quiet tools sit a step below the primary action. */
const TOOL_SIZE = 24;
/** Line box of one line of message text. */
const LINE_HEIGHT = 20;
/** A single empty line — the composer opens one line tall and grows from there. */
const MIN_TEXTAREA_HEIGHT = LINE_HEIGHT;
/** Auto-grow ceiling (~6 lines) before the textarea starts scrolling. */
const MAX_TEXTAREA_HEIGHT = 120;
/**
 * A failed transcription, with the server's machine-readable reason.
 *
 * `POST /api/ai-chat/transcribe` answers 503 with `{ message, code, settingsPath }` where `code`
 * is an `AiSpeechErrorCode` (`AI_SPEECH_NOT_CONFIGURED` / `AI_SPEECH_KEY_REJECTED` /
 * `AI_SPEECH_FAILED`). The panel's `onTranscribe` throws this so the input can render a
 * translated, actionable message with a link to the AI Providers page; a plain `Error` (network,
 * old server) keeps the message-only path.
 */
export class DictationError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = 'DictationError';
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = details.code;
        this.settingsPath = details.settingsPath;
        this.status = details.status;
    }
}
/** Codes the server sends for dictation failures (mirrors `AiSpeechErrorCode` in @gauzy/contracts). */
const SPEECH_NOT_CONFIGURED = 'AI_SPEECH_NOT_CONFIGURED';
const SPEECH_KEY_REJECTED = 'AI_SPEECH_KEY_REJECTED';
/** Fallback path when the server sent a code but no path (older server build). */
const DEFAULT_AI_SETTINGS_PATH = '/pages/settings/ai';
/** `0:07`, `1:23` — mm:ss, which is all a dictation take ever needs. */
function formatElapsed(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
}
/**
 * The recorder container format.
 *
 * Chrome and Firefox produce WebM/Opus; Safari has no WebM encoder and produces MP4/AAC. Asking for
 * an unsupported type throws, so the first supported one wins and the browser's own default is the
 * last resort. The server is told what it received via the blob's own MIME type.
 */
function pickRecorderMimeType() {
    if (typeof MediaRecorder === 'undefined')
        return undefined;
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    return candidates.find((type) => MediaRecorder.isTypeSupported(type));
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
export function ChatInput({ value, isBusy, translate: t = passthroughChatTranslate, onChange, onSubmit, onStop, onEscape, onTranscribe, onOpenAiSettings, onAttachFile, onAttachFromDocuments, isAttaching = false, composingFor }) {
    const textareaRef = useRef(null);
    const containerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [dictation, setDictation] = useState('idle');
    const [elapsed, setElapsed] = useState(0);
    const [autoSend, setAutoSend] = useState(false);
    const [dictationError, setDictationError] = useState(null);
    /** Latest settings opener, for the recorder's callbacks (attached once, at take start). */
    const onOpenAiSettingsRef = useRef(onOpenAiSettings);
    onOpenAiSettingsRef.current = onOpenAiSettings;
    /**
     * Turn a transcription failure into what the error block shows.
     *
     * Per server code: "not configured" and "key rejected" name the fix and — when this user may
     * open it — carry the settings link; a plain failure relays the server's own message, which
     * already says what the provider reported. Anything that is not a {@link DictationError} keeps
     * the generic fallback.
     */
    const describeDictationError = useCallback((error) => {
        if (!(error instanceof DictationError)) {
            return {
                message: error instanceof Error && error.message
                    ? error.message
                    : t('AI_ASSISTANT.DICTATION_FAILED', 'Could not transcribe the recording.')
            };
        }
        const canOpen = typeof onOpenAiSettingsRef.current === 'function';
        const settingsPath = error.settingsPath || DEFAULT_AI_SETTINGS_PATH;
        if (error.code === SPEECH_NOT_CONFIGURED) {
            return canOpen
                ? {
                    message: t('AI_ASSISTANT.DICTATION_NOT_CONFIGURED', 'Dictation needs a voice provider. Add one on the AI Providers settings page.'),
                    settingsPath
                }
                : {
                    message: t('AI_ASSISTANT.DICTATION_ASK_ADMIN', 'Dictation needs a voice provider — ask an administrator to add one in Settings → AI Providers.')
                };
        }
        if (error.code === SPEECH_KEY_REJECTED) {
            return canOpen
                ? {
                    message: t('AI_ASSISTANT.DICTATION_KEY_REJECTED', 'The voice provider rejected its API key. Update it on the AI Providers settings page.'),
                    settingsPath
                }
                : {
                    message: t('AI_ASSISTANT.DICTATION_KEY_REJECTED_ASK_ADMIN', 'The voice provider rejected its API key — ask an administrator to update it in Settings → AI Providers.')
                };
        }
        return { message: error.message || t('AI_ASSISTANT.DICTATION_FAILED', 'Could not transcribe the recording.') };
    }, [t]);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    /**
     * The live input text, for the recorder's callbacks.
     *
     * `recorder.onstop` is attached when the take STARTS, so it closes over the value from that
     * moment. The field stays editable throughout, so reading the closed-over copy would overwrite
     * anything typed while speaking.
     */
    const valueRef = useRef(value);
    valueRef.current = value;
    /**
     * Identifies the current take. Bumped whenever one is abandoned — Cancel, or the panel closing.
     *
     * Stopping the tracks is not enough on its own: `onstop` still fires, a `getUserMedia` already
     * in flight still resolves, and a transcription already posted still returns. Each of those
     * checks this counter and drops out if it has moved, so a closed panel cannot transcribe, submit,
     * or leave a second recorder holding the microphone.
     */
    const sessionRef = useRef(0);
    /** Guards the `await getUserMedia` window, where `dictation` is still 'idle'. */
    const startingRef = useRef(false);
    /**
     * Set by Cancel so the `stop` handler discards instead of transcribing.
     *
     * A ref, not state: `stop` fires from the recorder's own event and would otherwise read the
     * value captured when the handler was attached.
     */
    const cancelledRef = useRef(false);
    /** Latest auto-send choice, for the same reason — the checkbox can change mid-take. */
    const autoSendRef = useRef(false);
    autoSendRef.current = autoSend;
    /**
     * The rest of the props the recorder's callbacks need, for the same reason again.
     *
     * `recorder.onstop` is attached once, when the take starts. Reading `isBusy` or `onSubmit` from
     * that closure evaluates the auto-send guard against whatever was true a minute ago — refusing to
     * send because a since-finished response was streaming, or sending into one that has since begun.
     */
    const isBusyRef = useRef(isBusy);
    isBusyRef.current = isBusy;
    const onSubmitRef = useRef(onSubmit);
    onSubmitRef.current = onSubmit;
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const onTranscribeRef = useRef(onTranscribe);
    onTranscribeRef.current = onTranscribe;
    // Auto-resize textarea. The floor is one line box: the field sits above its own action row,
    // so it never has to match the height of anything beside it.
    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = `${Math.min(Math.max(el.scrollHeight, MIN_TEXTAREA_HEIGHT), MAX_TEXTAREA_HEIGHT)}px`;
        }
    }, [value]);
    // Tick the take timer. Owned by the state, so it cannot outlive a recording.
    useEffect(() => {
        if (dictation !== 'recording')
            return;
        const id = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, [dictation]);
    /** Release the microphone. Leaving tracks live keeps the browser's recording indicator on. */
    const releaseRecorder = useCallback(() => {
        recorderRef.current?.stream.getTracks().forEach((track) => track.stop());
        recorderRef.current = null;
    }, []);
    // A panel unmounted mid-take (sidebar collapsed, route change) must not hold the microphone, and
    // must not go on to transcribe or send what it captured. Invalidating the session is what stops
    // the in-flight callbacks; releasing the recorder only stops the hardware.
    useEffect(() => () => {
        sessionRef.current += 1;
        cancelledRef.current = true;
        try {
            recorderRef.current?.stop();
        }
        catch {
            // Already inactive — nothing to stop.
        }
        releaseRecorder();
    }, [releaseRecorder]);
    const startDictation = useCallback(async () => {
        // `dictation` is still 'idle' while the permission prompt is up, so it cannot guard this on
        // its own: a second click during the prompt would start a second recorder sharing `chunksRef`,
        // and only the last one would ever be released.
        if (!onTranscribe || dictation !== 'idle' || startingRef.current)
            return;
        startingRef.current = true;
        setDictationError(null);
        const session = sessionRef.current;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // The panel may have closed while the prompt was up. Take the microphone straight back.
            if (session !== sessionRef.current) {
                stream.getTracks().forEach((track) => track.stop());
                return;
            }
            const mimeType = pickRecorderMimeType();
            let recorder;
            try {
                recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            }
            catch (constructionError) {
                // `releaseRecorder` reads `recorderRef.current`, which is still null here — so the
                // stream just acquired would never be stopped and the microphone would stay live for
                // the life of the tab. Stop what we are actually holding.
                stream.getTracks().forEach((track) => track.stop());
                throw constructionError;
            }
            chunksRef.current = [];
            cancelledRef.current = false;
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0)
                    chunksRef.current.push(event.data);
            };
            recorder.onstop = () => {
                const audio = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
                chunksRef.current = [];
                releaseRecorder();
                if (cancelledRef.current || session !== sessionRef.current || audio.size === 0) {
                    setDictation('idle');
                    return;
                }
                setDictation('transcribing');
                onTranscribe(audio)
                    .then((text) => {
                    // Transcription outlives a panel the user closed while waiting.
                    if (session !== sessionRef.current)
                        return;
                    const spoken = text.trim();
                    if (!spoken)
                        return;
                    // Read the CURRENT draft, not the one captured when recording began — the field
                    // stays editable while speaking. APPENDED, because dictation is an input method
                    // rather than a replacement for one.
                    const draft = valueRef.current.trim();
                    const next = draft ? `${draft} ${spoken}` : spoken;
                    onChangeRef.current(next);
                    // The transcript goes to the parent EXPLICITLY: `onChange` has not been applied
                    // yet, so submitting without it would send the pre-dictation text.
                    if (autoSendRef.current && !isBusyRef.current)
                        onSubmitRef.current(next);
                })
                    .catch((error) => {
                    if (session !== sessionRef.current)
                        return;
                    setDictationError(describeDictationError(error));
                })
                    .finally(() => {
                    if (session === sessionRef.current)
                        setDictation('idle');
                });
            };
            recorderRef.current = recorder;
            // A time slice, so `ondataavailable` fires during the take: without it a tab suspended or
            // closed mid-recording loses everything buffered.
            recorder.start(1000);
            setElapsed(0);
            setDictation('recording');
        }
        catch (error) {
            releaseRecorder();
            setDictation('idle');
            setDictationError({
                message: error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'SecurityError')
                    ? t('AI_ASSISTANT.MIC_DENIED', 'Microphone access was denied.')
                    : t('AI_ASSISTANT.MIC_UNAVAILABLE', 'No microphone is available.')
            });
        }
        finally {
            startingRef.current = false;
        }
        // Deliberately narrow: everything the async callbacks need is read through a ref, so the
        // identity of this callback does not have to change when a prop does.
    }, [onTranscribe, dictation, releaseRecorder, t, describeDictationError]);
    // A conversation switch abandons the take, for the same reason a collapse does: the words were
    // meant for the chat that is no longer open.
    useEffect(() => {
        if (dictation === 'idle')
            return;
        cancelledRef.current = true;
        sessionRef.current += 1;
        try {
            recorderRef.current?.stop();
        }
        catch {
            // Already inactive.
        }
        releaseRecorder();
        setDictation('idle');
        // Deliberately keyed ONLY on the conversation: including `dictation` would abandon every take
        // the moment it started.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [composingFor]);
    // Collapsing the chat does NOT unmount this panel — the sidebar is hidden with `display: none` —
    // so the unmount teardown never runs and a take would keep recording with its Cancel and Done
    // buttons off screen. Losing visibility is treated as abandoning the take.
    useEffect(() => {
        if (dictation !== 'recording')
            return;
        const root = containerRef.current;
        if (!root || typeof IntersectionObserver === 'undefined')
            return;
        const observer = new IntersectionObserver((entries) => {
            // `display: none` yields a zero-area rect, which reads as not intersecting.
            if (entries.some((entry) => !entry.isIntersecting)) {
                cancelledRef.current = true;
                sessionRef.current += 1;
                try {
                    recorderRef.current?.stop();
                }
                catch {
                    // Already inactive.
                }
                releaseRecorder();
                setDictation('idle');
            }
        });
        observer.observe(root);
        return () => observer.disconnect();
    }, [dictation, releaseRecorder]);
    /**
     * Return focus to the composer.
     *
     * Done and Cancel remove the button that was focused, and the mic button is disabled in the same
     * instant, so focus would otherwise fall to `<body>` with nowhere sensible to resume.
     */
    const restoreFocus = useCallback(() => {
        textareaRef.current?.focus();
    }, []);
    const finishDictation = useCallback(() => {
        if (dictation !== 'recording')
            return;
        cancelledRef.current = false;
        recorderRef.current?.stop();
        restoreFocus();
    }, [dictation, restoreFocus]);
    const cancelDictation = useCallback(() => {
        if (dictation !== 'recording')
            return;
        cancelledRef.current = true;
        // Invalidate too, so a transcription already posted for this take is discarded on arrival.
        sessionRef.current += 1;
        recorderRef.current?.stop();
        restoreFocus();
    }, [dictation, restoreFocus]);
    function handleKeyDown(e) {
        // Ignore key events fired while an IME composition is active (e.g.
        // confirming Japanese/Chinese candidates with Enter must not submit).
        if (e.nativeEvent.isComposing || e.key === 'Process')
            return;
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !isBusy) {
                onSubmit();
            }
        }
        else if (e.key === 'Escape') {
            e.preventDefault();
            // Escape belongs to the recording first: abandoning a take should not also close the chat.
            if (dictation === 'recording')
                cancelDictation();
            else
                onEscape?.();
        }
    }
    const containerStyle = {
        borderTop: `1px solid ${chatTheme.border}`,
        padding: '10px 12px 12px',
        flexShrink: 0
    };
    // The message is written across the FULL width and the controls tuck underneath it, rather
    // than the field being squeezed between two clusters of buttons on one row.
    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 6,
        backgroundColor: chatTheme.inputBg,
        borderRadius: chatTheme.inputRadius,
        border: `1px solid ${isFocused ? chatTheme.inputFocusBorder : chatTheme.inputBorder}`,
        // A visible focus ring is what tells the user the composer is live; the border
        // alone moved by one hairline and read as no change at all.
        boxShadow: isFocused ? chatTheme.inputFocusRing : 'none',
        padding: '8px 8px 6px',
        transition: `border-color ${chatTheme.transitionSpeed} ease, box-shadow ${chatTheme.transitionSpeed} ease`
    };
    /** The action row under the message: quiet tools left, Send pushed to the end. */
    const toolRowStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        minWidth: 0
    };
    const textareaStyle = {
        width: '100%',
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        color: chatTheme.inputText,
        fontSize: chatTheme.fontSizeInput,
        fontFamily: chatTheme.fontFamily,
        lineHeight: `${LINE_HEIGHT}px`,
        letterSpacing: '0.01em',
        resize: 'none',
        // Nothing sits beside the field any more, so it needs no padding of its own to line up
        // against: the form's padding is the whole inset, and the box is exactly its text.
        minHeight: MIN_TEXTAREA_HEIGHT,
        maxHeight: MAX_TEXTAREA_HEIGHT,
        padding: '0 2px',
        boxSizing: 'border-box',
        margin: 0,
        minWidth: 0,
        // No stray scrollbars/borders/native chrome inside the field — the
        // surrounding form provides the visual box; scroll vertically only
        // once the 3-line auto-grow limit is reached.
        overflowX: 'hidden',
        overflowY: 'auto',
        boxShadow: 'none',
        appearance: 'none',
        WebkitAppearance: 'none'
    };
    const canSend = Boolean(value.trim());
    const buttonStyle = {
        width: SEND_SIZE,
        height: SEND_SIZE,
        borderRadius: '50%',
        backgroundColor: isBusy ? chatTheme.red : chatTheme.accent,
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        // Anchored to the end of the action row, away from the quiet tools.
        marginLeft: 'auto',
        padding: 0,
        boxShadow: !isBusy && !canSend ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.18)',
        opacity: !isBusy && !canSend ? 0.35 : 1,
        outline: 'none'
    };
    /** The quiet leading-edge tools: attach, library, dictate. */
    const toolButtonStyle = (active = false, enabled = true) => ({
        width: TOOL_SIZE,
        height: TOOL_SIZE,
        borderRadius: 6,
        backgroundColor: active ? chatTheme.redSoft : 'transparent',
        color: active ? chatTheme.red : chatTheme.textMuted,
        border: 'none',
        cursor: enabled ? 'pointer' : 'not-allowed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        opacity: enabled ? 1 : 0.45,
        padding: 0,
        outline: 'none'
    });
    const recordingPanelStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
        padding: '7px 10px',
        borderRadius: chatTheme.inputRadius,
        border: `1px solid ${chatTheme.inputBorder}`,
        backgroundColor: chatTheme.inputBg,
        fontSize: chatTheme.fontSizeSmall,
        lineHeight: 1.5,
        color: chatTheme.inputText
    };
    const panelButtonStyle = (primary) => ({
        border: `1px solid ${primary ? chatTheme.accent : chatTheme.inputBorder}`,
        backgroundColor: 'transparent',
        color: primary ? chatTheme.accent : chatTheme.inputText,
        borderRadius: chatTheme.controlRadius,
        padding: '4px 11px',
        fontSize: chatTheme.fontSizeSmall,
        fontWeight: chatTheme.fontWeightMedium,
        fontFamily: chatTheme.fontFamily,
        lineHeight: 1.5,
        cursor: 'pointer',
        outline: 'none'
    });
    const isRecording = dictation === 'recording';
    const isTranscribing = dictation === 'transcribing';
    return (_jsxs("div", { ref: containerRef, style: containerStyle, children: [(isRecording || isTranscribing) && (_jsxs("div", { style: recordingPanelStyle, children: [_jsxs("span", { style: { display: 'inline-flex', alignItems: 'center', gap: 6 }, children: [_jsx("span", { "aria-hidden": "true", style: {
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: isRecording ? chatTheme.red : chatTheme.textMuted,
                                    display: 'inline-block'
                                } }), isRecording ? formatElapsed(elapsed) : t('AI_ASSISTANT.TRANSCRIBING', 'Transcribing…')] }), isRecording && (_jsxs(_Fragment, { children: [_jsx("span", { "aria-hidden": "true", style: { opacity: 0.4 }, children: "|" }), _jsxs("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }, children: [_jsx("input", { type: "checkbox", checked: autoSend, onChange: (e) => setAutoSend(e.target.checked), style: { margin: 0, cursor: 'pointer' } }), t('AI_ASSISTANT.AUTO_SEND', 'Auto-send')] }), _jsxs("span", { style: { marginLeft: 'auto', display: 'inline-flex', gap: 6 }, children: [_jsx("button", { type: "button", onClick: cancelDictation, style: panelButtonStyle(false), children: t('AI_ASSISTANT.CANCEL', 'Cancel') }), _jsx("button", { type: "button", onClick: finishDictation, style: panelButtonStyle(true), children: t('AI_ASSISTANT.DONE', 'Done') })] })] }))] })), dictationError && (_jsxs("div", { role: "alert", style: {
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 6,
                    marginBottom: 8,
                    padding: '6px 9px',
                    borderRadius: chatTheme.controlRadius,
                    backgroundColor: 'rgba(255, 61, 113, 0.1)',
                    fontSize: chatTheme.fontSizeSmall,
                    lineHeight: 1.5,
                    color: chatTheme.red
                }, children: [_jsxs("span", { style: { flex: 1 }, children: [dictationError.message, dictationError.settingsPath && onOpenAiSettings && (_jsxs(_Fragment, { children: [' ', _jsx("button", { type: "button", onClick: () => {
                                            onOpenAiSettings(dictationError.settingsPath);
                                            setDictationError(null);
                                        }, style: {
                                            border: 'none',
                                            background: 'transparent',
                                            color: chatTheme.accent,
                                            cursor: 'pointer',
                                            padding: 0,
                                            font: 'inherit',
                                            textDecoration: 'underline'
                                        }, children: t('AI_ASSISTANT.DICTATION_OPEN_SETTINGS', 'Open AI Providers') })] }))] }), _jsx("button", { type: "button", onClick: () => setDictationError(null), style: {
                            border: 'none',
                            background: 'transparent',
                            color: 'inherit',
                            cursor: 'pointer',
                            padding: 0,
                            lineHeight: 1
                        }, title: t('AI_ASSISTANT.DISMISS', 'Dismiss'), "aria-label": t('AI_ASSISTANT.DISMISS', 'Dismiss'), children: "\u00D7" })] })), _jsxs("form", { onSubmit: (e) => {
                    e.preventDefault();
                    if (value.trim() && !isBusy)
                        onSubmit();
                }, style: formStyle, children: [onAttachFile && (_jsx("input", { ref: fileInputRef, type: "file", style: { display: 'none' }, onChange: (event) => {
                            const file = event.target.files?.[0];
                            // Reset first: picking the SAME file twice fires no change event
                            // otherwise, so a failed attachment could never be retried.
                            event.target.value = '';
                            if (file)
                                void onAttachFile(file);
                        } })), _jsx("textarea", { ref: textareaRef, value: value, onChange: (e) => onChange(e.target.value), onKeyDown: handleKeyDown, onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false), placeholder: t('AI_ASSISTANT.PLACEHOLDER', 'Type a message…'), rows: 1, className: "gz-ai-chat-textarea", style: textareaStyle, "aria-label": t('AI_ASSISTANT.PLACEHOLDER', 'Type a message…') }), _jsxs("div", { style: toolRowStyle, children: [_jsx("button", { type: "button", ...(onAttachFile && !isAttaching
                                    ? { onClick: () => fileInputRef.current?.click() }
                                    : { 'aria-disabled': true, onClick: (e) => e.preventDefault() }), className: "gz-ai-chat-tool-btn", style: toolButtonStyle(false, Boolean(onAttachFile) && !isAttaching), title: onAttachFile
                                    ? t('AI_ASSISTANT.ATTACH', 'Attach a file')
                                    : t('AI_ASSISTANT.ATTACH_SOON', 'Attach files or folders (coming soon)'), "aria-label": onAttachFile
                                    ? t('AI_ASSISTANT.ATTACH', 'Attach a file')
                                    : t('AI_ASSISTANT.ATTACH_SOON', 'Attach files or folders (coming soon)'), children: _jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" }) }) }), _jsx("button", { type: "button", ...(onAttachFromDocuments && !isAttaching
                                    ? { onClick: () => onAttachFromDocuments() }
                                    : { 'aria-disabled': true, onClick: (e) => e.preventDefault() }), className: "gz-ai-chat-tool-btn", style: toolButtonStyle(false, Boolean(onAttachFromDocuments) && !isAttaching), title: onAttachFromDocuments
                                    ? t('AI_ASSISTANT.ATTACH_FROM_DOCUMENTS', 'Attach from Documents')
                                    : t('AI_ASSISTANT.LIBRARY_SOON', 'Choose from the file library (coming soon)'), "aria-label": onAttachFromDocuments
                                    ? t('AI_ASSISTANT.ATTACH_FROM_DOCUMENTS', 'Attach from Documents')
                                    : t('AI_ASSISTANT.LIBRARY_SOON', 'Choose from the file library (coming soon)'), children: _jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), _jsx("polyline", { points: "14 2 14 8 20 8" }), _jsx("line", { x1: "8", y1: "13", x2: "16", y2: "13" }), _jsx("line", { x1: "8", y1: "17", x2: "13", y2: "17" })] }) }), onTranscribe && (_jsx("button", { type: "button", onClick: isRecording ? finishDictation : startDictation, disabled: isTranscribing, className: "gz-ai-chat-tool-btn", style: toolButtonStyle(isRecording, !isTranscribing), title: isRecording
                                    ? t('AI_ASSISTANT.STOP_DICTATION', 'Stop dictation')
                                    : t('AI_ASSISTANT.DICTATE', 'Dictate a message'), "aria-label": isRecording
                                    ? t('AI_ASSISTANT.STOP_DICTATION', 'Stop dictation')
                                    : t('AI_ASSISTANT.DICTATE', 'Dictate a message'), "aria-pressed": isRecording, children: _jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" }), _jsx("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }), _jsx("line", { x1: "12", y1: "19", x2: "12", y2: "23" })] }) })), isBusy ? (_jsx("button", { type: "button", onClick: onStop, className: "gz-ai-chat-send-btn", style: buttonStyle, title: t('AI_ASSISTANT.STOP', 'Stop generating'), "aria-label": t('AI_ASSISTANT.STOP', 'Stop generating'), children: _jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2" }) }) })) : (_jsx("button", { type: "submit", disabled: !canSend, className: "gz-ai-chat-send-btn", style: buttonStyle, title: t('AI_ASSISTANT.SEND', 'Send message'), "aria-label": t('AI_ASSISTANT.SEND', 'Send message'), children: _jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }), _jsx("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })] }) }))] })] })] }));
}
//# sourceMappingURL=ChatInput.js.map