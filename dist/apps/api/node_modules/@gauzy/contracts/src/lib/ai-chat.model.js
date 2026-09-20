"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_CHAT_RATE_LIMIT_CODE = exports.AI_CHAT_SETTINGS_PATH = exports.AiSpeechErrorCode = exports.AiProviderEnum = void 0;
/**
 * Well-known AI provider identifiers.
 *
 * Each provider is implemented as its own backend plugin
 * (e.g. `@gauzy/plugin-ai-provider-anthropic`) that registers itself
 * with the `@gauzy/plugin-ai-chat` provider registry. Additional
 * providers may register with ids outside this enum.
 */
var AiProviderEnum;
(function (AiProviderEnum) {
    AiProviderEnum["ANTHROPIC"] = "anthropic";
    AiProviderEnum["OPENAI"] = "openai";
    AiProviderEnum["OPENROUTER"] = "openrouter";
    AiProviderEnum["VERCEL_GATEWAY"] = "vercel-gateway";
    AiProviderEnum["GAUZY_AI"] = "gauzy-ai";
    AiProviderEnum["GEMINI"] = "gemini";
    AiProviderEnum["GROK"] = "grok";
    /** Groq cloud — OpenAI-compatible chat + Whisper speech-to-text. */
    AiProviderEnum["GROQ"] = "groq";
    /** Mistral AI — OpenAI-compatible chat + Voxtral speech-to-text. */
    AiProviderEnum["MISTRAL"] = "mistral";
    /** Deepgram — speech-to-text only (Nova models). */
    AiProviderEnum["DEEPGRAM"] = "deepgram";
    /** ElevenLabs — speech-to-text only (Scribe). */
    AiProviderEnum["ELEVENLABS"] = "elevenlabs";
    /** Speaches (faster-whisper-server) — LOCAL speech-to-text server. */
    AiProviderEnum["SPEACHES"] = "speaches";
    /** LocalAI — LOCAL OpenAI-compatible chat + whisper speech-to-text. */
    AiProviderEnum["LOCALAI"] = "localai";
    /** whisper.cpp `whisper-server` — LOCAL speech-to-text. */
    AiProviderEnum["WHISPER_CPP"] = "whisper-cpp";
    /** Any self-hosted OpenAI-compatible endpoint (vLLM, LM Studio, Ollama, LiteLLM …). */
    AiProviderEnum["OPENAI_COMPATIBLE"] = "openai-compatible";
})(AiProviderEnum || (exports.AiProviderEnum = AiProviderEnum = {}));
/**
 * Machine-readable reasons a dictation (`POST /api/ai-chat/transcribe`) request fails with 503.
 *
 * Shared by the API (which puts them in the error body) and the chat client (which maps them to a
 * translated, actionable message with a deep link to the AI Providers settings page).
 */
var AiSpeechErrorCode;
(function (AiSpeechErrorCode) {
    /** No speech-capable provider has usable credentials for this tenant. */
    AiSpeechErrorCode["NOT_CONFIGURED"] = "AI_SPEECH_NOT_CONFIGURED";
    /** A speech provider rejected the credential (HTTP 401/403). */
    AiSpeechErrorCode["KEY_REJECTED"] = "AI_SPEECH_KEY_REJECTED";
    /** Every attempted speech provider failed for another reason. */
    AiSpeechErrorCode["FAILED"] = "AI_SPEECH_FAILED";
})(AiSpeechErrorCode || (exports.AiSpeechErrorCode = AiSpeechErrorCode = {}));
/** Route of the AI Providers settings page, deep-linked from speech errors. */
exports.AI_CHAT_SETTINGS_PATH = '/pages/settings/ai';
/**
 * Discriminator for a provider rate-limit (HTTP 429) reported through the chat stream.
 *
 * Lives in contracts because BOTH sides need the runtime value: the API writes the envelope into the
 * stream's error channel, and the browser matches on it. It must not come from the backend plugin —
 * importing that into the web bundle would pull NestJS along with it.
 */
exports.AI_CHAT_RATE_LIMIT_CODE = 'ai-chat/rate-limited';
//# sourceMappingURL=ai-chat.model.js.map