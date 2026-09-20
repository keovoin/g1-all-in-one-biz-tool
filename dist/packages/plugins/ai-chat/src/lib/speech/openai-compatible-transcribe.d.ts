/**
 * Shared speech-to-text plumbing for provider plugins.
 *
 * Nearly every STT API is "POST multipart audio, get `{ text }` back" — OpenAI, Groq, Mistral,
 * Speaches, LocalAI and any OpenAI-compatible gateway literally share the `/audio/transcriptions`
 * shape, ElevenLabs and whisper.cpp differ only in field names — so the request, the bounded error
 * read, the secret redaction and the failure classification live here ONCE. A provider plugin
 * supplies its endpoint, its auth header and its model, and gets back either a transcript or a
 * {@link SpeechProviderError} whose `kind` the chat engine can act on without regex-sniffing prose.
 */
import { SpeechProviderErrorKind } from './speech-provider-error';
import type { HostnameResolver } from '../ssrf';
/**
 * Upstream budget for a transcription.
 *
 * Longer than a catalogue fetch on purpose: a minute of speech takes real time to process, and the
 * user is watching a spinner they started deliberately rather than a background refresh.
 */
export declare const TRANSCRIBE_TIMEOUT_MS = 60000;
/**
 * Upper bound on the upstream error body read for a diagnostic message.
 *
 * Far more than any real API error needs, and small enough that a custom base URL answering with
 * an arbitrarily large body cannot make this process buffer it: `response.text()` reads EVERYTHING
 * before a display-side `slice` ever runs, so the bound has to be applied while reading.
 */
export declare const MAX_ERROR_DETAIL_BYTES = 2048;
/** Read at most `maxBytes` of a response body, then cancel the rest of the stream. */
export declare const readBounded: (response: globalThis.Response, maxBytes: number) => Promise<string>;
/**
 * Strip the credential in use and anything key-shaped from text bound for the user.
 *
 * Both patterns matter: OpenAI keys are `sk-…`, but a custom base URL (Azure, a proxy) issues keys
 * with no recognizable prefix — only redacting by shape would relay exactly the secret this exists
 * to protect. Display-truncated at the end so the redaction cannot be sliced through mid-token.
 */
export declare const redactSecret: (text: string, apiKey?: string) => string;
/**
 * Container extension for the multipart filename, derived from the MIME type the browser recorded.
 *
 * `/v1/audio/transcriptions` decides the container from the filename EXTENSION, so a generic name is
 * rejected with "Invalid file format" even when the bytes are fine. `webm` is the fallback: it is
 * what `MediaRecorder` produces by default everywhere except Safari.
 */
export declare const resolveAudioExtension: (mimeType: string) => string;
/**
 * Classify a non-2xx speech response by STATUS NUMBER only.
 *
 * statusText is upstream-controlled prose, and a custom base URL means upstream is whatever the
 * tenant configured, so it gets no free ride into a user-visible message.
 */
export declare const classifySpeechHttpFailure: (status: number) => {
    kind: SpeechProviderErrorKind;
    reason: string;
};
/** Trim a trailing slash so `${base}/path` never doubles it. */
export declare const trimTrailingSlash: (url: string) => string;
/**
 * Upper bound on a transcript relayed back to the caller.
 *
 * A 2xx body's `text` was returned verbatim with no cap, so a tenant-configured endpoint answering
 * `{"text": "<megabytes>"}` was an unbounded read reflected straight into the chat panel. Generous
 * next to any real dictation (roughly 10k words of speech) and small enough not to matter.
 */
export declare const MAX_TRANSCRIPT_CHARS: number;
/**
 * Upper bound on a SUCCESSFUL transcription response read off the wire.
 *
 * {@link MAX_TRANSCRIPT_CHARS} caps what is relayed, but `response.json()` would already have buffered
 * whatever a tenant-configured endpoint chose to send before that slice ran. This bound is applied
 * while reading. Sized for the verbose shapes (Deepgram's per-word timings for a long dictation run to
 * a megabyte or two), not for the transcript alone.
 */
export declare const MAX_TRANSCRIPTION_RESPONSE_BYTES: number;
/** Base arguments shared by every speech request helper. */
export interface ISpeechRequestBase {
    /**
     * Permit a loopback/private/link-local endpoint for THIS request. Defaults to the deployment's
     * `GAUZY_AI_CHAT_ALLOW_PRIVATE_BASE_URLS` flag. Provider plugins pass
     * `isPrivateAiProviderEndpointAllowed(credentials)`, never a value derived from tenant input.
     */
    allowPrivateHost?: boolean;
    /** DNS resolver for the SSRF egress pre-flight; `dns.lookup` when unset. A seam for tests. */
    resolver?: HostnameResolver;
    /** Human-readable provider name used in error messages ("OpenAI transcription failed: …"). */
    providerLabel: string;
    /** Registry id, attached to the thrown {@link SpeechProviderError}. */
    providerId?: string;
    /** Credential in use, redacted from any relayed error body. Empty/undefined = none. */
    apiKey?: string;
    /** Upstream budget. Defaults to {@link TRANSCRIBE_TIMEOUT_MS}. */
    timeoutMs?: number;
}
/** Arguments of {@link speechRequest}. */
export interface ISpeechRequestArgs extends ISpeechRequestBase {
    url: string;
    init: RequestInit;
    /**
     * Turn the parsed 2xx JSON body into the transcript. Defaults to reading `text`. Throw to signal a
     * malformed body — it is wrapped as a `response`-kind error.
     */
    parse?: (body: unknown) => string;
}
/**
 * Perform one speech HTTP request and return the transcript, or throw a {@link SpeechProviderError}.
 *
 * Handles what every provider would otherwise re-implement: the timeout, network failures, the
 * status-based classification, the bounded + redacted error body (never relayed on a credential
 * failure, whose body echoes the key back), and JSON parsing of the success body.
 */
export declare function speechRequest(args: ISpeechRequestArgs): Promise<string>;
/** Arguments of {@link transcribeMultipart}. */
export interface ITranscribeMultipartArgs extends ISpeechRequestBase {
    /** Full endpoint URL. */
    url: string;
    audio: Buffer;
    mimeType: string;
    /** Multipart field carrying the audio. Defaults to `file`. */
    fileField?: string;
    /** Additional multipart fields (`model`, `model_id`, `response_format`, `language`, …). */
    fields?: Record<string, string | undefined>;
    /** Request headers (auth etc.). `Content-Type` is set by fetch from the FormData boundary. */
    headers?: Record<string, string>;
    /** See {@link ISpeechRequestArgs.parse}. */
    parse?: (body: unknown) => string;
}
/**
 * POST a multipart transcription request. The filename EXTENSION is derived from the browser's MIME
 * type because most servers decide the container from it (see {@link resolveAudioExtension}).
 */
export declare function transcribeMultipart(args: ITranscribeMultipartArgs): Promise<string>;
/** Arguments of {@link transcribeViaOpenAiCompatible}. */
export interface ITranscribeViaOpenAiCompatibleArgs extends ISpeechRequestBase {
    /** API base including the version segment (`https://api.openai.com/v1`, `http://localhost:8000/v1`). */
    baseUrl: string;
    audio: Buffer;
    mimeType: string;
    /** Speech model id sent as the `model` field. */
    model: string;
    /** Endpoint path under `baseUrl`. Defaults to `/audio/transcriptions`. */
    path?: string;
    /** Extra headers merged after the `Authorization` header. */
    headers?: Record<string, string>;
    /** Optional ISO-639-1 language hint (`language` field). */
    language?: string;
    /** Extra form fields for servers that want them (e.g. `response_format`). */
    fields?: Record<string, string | undefined>;
}
/**
 * Speech-to-text through an OpenAI-shaped `POST {baseUrl}/audio/transcriptions` endpoint.
 *
 * Used verbatim by OpenAI, Groq, Mistral, Speaches, LocalAI and any OpenAI-compatible gateway. The
 * `Authorization: Bearer` header is only sent when there IS a key — local servers commonly run
 * without one, and `Bearer ` (empty) is rejected by some of them.
 *
 * No `response_format` unless the caller asks: OpenAI's `gpt-4o-*-transcribe` models accept ONLY
 * `json` (the default) and reject `text` outright, so sending it would fail every dictation.
 */
export declare function transcribeViaOpenAiCompatible(args: ITranscribeViaOpenAiCompatibleArgs): Promise<string>;
