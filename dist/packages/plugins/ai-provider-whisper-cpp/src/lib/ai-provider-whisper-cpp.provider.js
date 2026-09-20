"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whisperCppProviderDefinition = void 0;
const contracts_1 = require("@gauzy/contracts");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
/** Stable provider id used by the registry, the UI and BYOK credentials. */
const PROVIDER_ID = contracts_1.AiProviderEnum.WHISPER_CPP;
/**
 * Where `whisper-server` listens by default (`./build/bin/whisper-server -m models/ggml-base.en.bin`
 * → `http://127.0.0.1:8080`). No `/v1` — whisper.cpp is not OpenAI-shaped.
 */
const DEFAULT_BASE_URL = 'http://localhost:8080';
/**
 * whisper-server loads ONE model at start-up (`-m`), so there is nothing to pick here — a single
 * label stands in for "whatever the server was started with", and it is what the settings page shows.
 */
const SERVER_MODEL_ID = 'server';
const SPEECH_MODELS = [
    { id: SERVER_MODEL_ID, label: 'whisper.cpp (server model)', providerId: PROVIDER_ID }
];
/**
 * Speech-to-text through whisper.cpp's `POST {baseUrl}/inference`.
 *
 * Multipart with `file` + `response_format=json` (the default is plain text); the transcript comes
 * back as `text`. `language` is optional (`auto` when omitted). There is no model field — the
 * server's model is fixed at start-up — and no auth (whisper-server has none; put it behind a proxy
 * if it must be reachable beyond localhost). `temperature=0` for deterministic dictation.
 */
const transcribeAudio = async (audio, mimeType, credentials, options) => (0, plugin_ai_chat_1.transcribeMultipart)({
    url: `${(0, plugin_ai_chat_1.trimTrailingSlash)(credentials.baseUrl || DEFAULT_BASE_URL)}/inference`,
    audio,
    mimeType,
    fields: {
        response_format: 'json',
        temperature: '0',
        language: options?.language
    },
    // A key is not something whisper-server understands, but a reverse proxy in front of it may:
    // forward it as a bearer token when the tenant configured one.
    headers: credentials.apiKey ? { authorization: `Bearer ${credentials.apiKey}` } : {},
    apiKey: credentials.apiKey,
    providerLabel: 'whisper.cpp',
    providerId: PROVIDER_ID,
    allowPrivateHost: (0, plugin_ai_chat_1.isPrivateAiProviderEndpointAllowed)(credentials)
});
/**
 * whisper.cpp (`whisper-server`) provider definition — LOCAL SPEECH-TO-TEXT ONLY.
 *
 * Runs on the tenant's / operator's own machine, needs no API key, and is `chatCapable: false`: it
 * appears in the catalogue as a local voice provider and can be the tenant's voice default, but is
 * never selectable for chat.
 */
exports.whisperCppProviderDefinition = {
    id: PROVIDER_ID,
    label: 'whisper.cpp',
    apiKeyEnvVars: ['WHISPER_CPP_API_KEY'],
    baseUrlEnvVar: 'WHISPER_CPP_BASE_URL',
    models: [],
    defaultModel: '',
    chatCapable: false,
    requiresApiKey: false,
    local: true,
    defaultBaseUrl: DEFAULT_BASE_URL,
    transcribe: transcribeAudio,
    speech: { models: SPEECH_MODELS, defaultModel: SERVER_MODEL_ID },
    order: 102,
    websiteUrl: 'https://github.com/ggml-org/whisper.cpp',
    /**
     * Not a chat provider.
     *
     * @param _modelId Ignored.
     * @param _credentials Ignored.
     * @throws Always — whisper.cpp serves speech-to-text only.
     */
    async createModel(_modelId, _credentials) {
        throw new Error('whisper.cpp is a speech-to-text server and cannot serve chat — select another provider for chat.');
    }
};
//# sourceMappingURL=ai-provider-whisper-cpp.provider.js.map