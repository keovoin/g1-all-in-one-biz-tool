"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatAttachmentSavedEvent = exports.AiProviderCredentialModule = exports.AiProviderCredentialService = exports.AiProviderCredential = exports.assertSafeAiProviderBaseUrl = exports.IsSafeAiProviderBaseUrl = exports.ssrfSafeFetch = exports.isSsrfBlockedError = exports.isSafeAiProviderBaseUrl = exports.isPrivateAiProviderEndpointAllowed = exports.isPrivateAiProviderBaseUrlAllowed = exports.getUnsafeAiProviderBaseUrlReason = exports.getUnsafeAiOutboundUrlReason = exports.createAiProviderSdkFetch = exports.SsrfBlockedError = exports.ALLOW_PRIVATE_BASE_URLS_ENV = exports.buildRateLimitEnvelope = exports.rateLimitRetryAfter = exports.isRateLimitError = exports.RATE_LIMIT_CODE = exports.selfHostedCatalogue = exports.publicCatalogue = exports.prettifyModelId = exports.mergeCatalogue = exports.keyedCatalogue = exports.fetchCatalogueJson = exports.credentialCacheKey = exports.createCatalogueCache = exports.createDeferredDataPartWriter = exports.AiChatToolRegistry = exports.trimTrailingSlash = exports.transcribeViaOpenAiCompatible = exports.transcribeMultipart = exports.speechRequest = exports.resolveAudioExtension = exports.redactSecret = exports.readBounded = exports.isSpeechProviderError = exports.classifySpeechHttpFailure = exports.TRANSCRIBE_TIMEOUT_MS = exports.SpeechProviderError = exports.MAX_ERROR_DETAIL_BYTES = exports.loadAiSdk = exports.importEsm = exports.BaseAiProviderPlugin = exports.AiProviderRegistry = exports.AiChatController = exports.AiChatService = exports.AiChatModule = exports.AiChatPlugin = void 0;
exports.AiChatConversationModule = exports.AiChatConversationService = exports.AiChatConversation = exports.MAX_ATTACHMENT_BYTES = exports.AiChatAttachmentService = void 0;
/*
 * Public API Surface of @gauzy/plugin-ai-chat
 */
var ai_chat_plugin_1 = require("./lib/ai-chat.plugin");
Object.defineProperty(exports, "AiChatPlugin", { enumerable: true, get: function () { return ai_chat_plugin_1.AiChatPlugin; } });
var ai_chat_module_1 = require("./lib/ai-chat.module");
Object.defineProperty(exports, "AiChatModule", { enumerable: true, get: function () { return ai_chat_module_1.AiChatModule; } });
var ai_chat_service_1 = require("./lib/ai-chat.service");
Object.defineProperty(exports, "AiChatService", { enumerable: true, get: function () { return ai_chat_service_1.AiChatService; } });
var ai_chat_controller_1 = require("./lib/ai-chat.controller");
Object.defineProperty(exports, "AiChatController", { enumerable: true, get: function () { return ai_chat_controller_1.AiChatController; } });
// Provider SPI — implemented by @gauzy/plugin-ai-provider-* plugins
var provider_registry_1 = require("./lib/provider-registry");
Object.defineProperty(exports, "AiProviderRegistry", { enumerable: true, get: function () { return provider_registry_1.AiProviderRegistry; } });
var base_ai_provider_plugin_1 = require("./lib/base-ai-provider.plugin");
Object.defineProperty(exports, "BaseAiProviderPlugin", { enumerable: true, get: function () { return base_ai_provider_plugin_1.BaseAiProviderPlugin; } });
var esm_loader_1 = require("./lib/esm-loader");
Object.defineProperty(exports, "importEsm", { enumerable: true, get: function () { return esm_loader_1.importEsm; } });
Object.defineProperty(exports, "loadAiSdk", { enumerable: true, get: function () { return esm_loader_1.loadAiSdk; } });
// Speech-to-text SPI: the shared multipart/JSON transcription request, its error classification and
// the typed error the chat engine maps onto the wire-level AiSpeechErrorCode.
var speech_1 = require("./lib/speech");
Object.defineProperty(exports, "MAX_ERROR_DETAIL_BYTES", { enumerable: true, get: function () { return speech_1.MAX_ERROR_DETAIL_BYTES; } });
Object.defineProperty(exports, "SpeechProviderError", { enumerable: true, get: function () { return speech_1.SpeechProviderError; } });
Object.defineProperty(exports, "TRANSCRIBE_TIMEOUT_MS", { enumerable: true, get: function () { return speech_1.TRANSCRIBE_TIMEOUT_MS; } });
Object.defineProperty(exports, "classifySpeechHttpFailure", { enumerable: true, get: function () { return speech_1.classifySpeechHttpFailure; } });
Object.defineProperty(exports, "isSpeechProviderError", { enumerable: true, get: function () { return speech_1.isSpeechProviderError; } });
Object.defineProperty(exports, "readBounded", { enumerable: true, get: function () { return speech_1.readBounded; } });
Object.defineProperty(exports, "redactSecret", { enumerable: true, get: function () { return speech_1.redactSecret; } });
Object.defineProperty(exports, "resolveAudioExtension", { enumerable: true, get: function () { return speech_1.resolveAudioExtension; } });
Object.defineProperty(exports, "speechRequest", { enumerable: true, get: function () { return speech_1.speechRequest; } });
Object.defineProperty(exports, "transcribeMultipart", { enumerable: true, get: function () { return speech_1.transcribeMultipart; } });
Object.defineProperty(exports, "transcribeViaOpenAiCompatible", { enumerable: true, get: function () { return speech_1.transcribeViaOpenAiCompatible; } });
Object.defineProperty(exports, "trimTrailingSlash", { enumerable: true, get: function () { return speech_1.trimTrailingSlash; } });
// Chat-tool extension SPI — other plugins (e.g. @gauzy/plugin-docs) contribute per-turn tools
var tool_registry_1 = require("./lib/tools/tool-registry");
Object.defineProperty(exports, "AiChatToolRegistry", { enumerable: true, get: function () { return tool_registry_1.AiChatToolRegistry; } });
var data_parts_1 = require("./lib/tools/data-parts");
Object.defineProperty(exports, "createDeferredDataPartWriter", { enumerable: true, get: function () { return data_parts_1.createDeferredDataPartWriter; } });
// Shared plumbing for provider model catalogues: bounded fetch, credential-keyed cache, fail-open.
var model_catalogue_1 = require("./lib/model-catalogue");
Object.defineProperty(exports, "createCatalogueCache", { enumerable: true, get: function () { return model_catalogue_1.createCatalogueCache; } });
Object.defineProperty(exports, "credentialCacheKey", { enumerable: true, get: function () { return model_catalogue_1.credentialCacheKey; } });
Object.defineProperty(exports, "fetchCatalogueJson", { enumerable: true, get: function () { return model_catalogue_1.fetchCatalogueJson; } });
Object.defineProperty(exports, "keyedCatalogue", { enumerable: true, get: function () { return model_catalogue_1.keyedCatalogue; } });
Object.defineProperty(exports, "mergeCatalogue", { enumerable: true, get: function () { return model_catalogue_1.mergeCatalogue; } });
Object.defineProperty(exports, "prettifyModelId", { enumerable: true, get: function () { return model_catalogue_1.prettifyModelId; } });
Object.defineProperty(exports, "publicCatalogue", { enumerable: true, get: function () { return model_catalogue_1.publicCatalogue; } });
Object.defineProperty(exports, "selfHostedCatalogue", { enumerable: true, get: function () { return model_catalogue_1.selfHostedCatalogue; } });
// Rate-limit classification + the envelope the chat client parses out of the stream's error channel.
var rate_limit_1 = require("./lib/rate-limit");
Object.defineProperty(exports, "RATE_LIMIT_CODE", { enumerable: true, get: function () { return rate_limit_1.RATE_LIMIT_CODE; } });
Object.defineProperty(exports, "isRateLimitError", { enumerable: true, get: function () { return rate_limit_1.isRateLimitError; } });
Object.defineProperty(exports, "rateLimitRetryAfter", { enumerable: true, get: function () { return rate_limit_1.rateLimitRetryAfter; } });
Object.defineProperty(exports, "buildRateLimitEnvelope", { enumerable: true, get: function () { return rate_limit_1.buildRateLimitEnvelope; } });
// SSRF egress guard for tenant-supplied provider endpoints (base-URL validation + guarded fetch).
var ssrf_1 = require("./lib/ssrf");
Object.defineProperty(exports, "ALLOW_PRIVATE_BASE_URLS_ENV", { enumerable: true, get: function () { return ssrf_1.ALLOW_PRIVATE_BASE_URLS_ENV; } });
Object.defineProperty(exports, "SsrfBlockedError", { enumerable: true, get: function () { return ssrf_1.SsrfBlockedError; } });
Object.defineProperty(exports, "createAiProviderSdkFetch", { enumerable: true, get: function () { return ssrf_1.createAiProviderSdkFetch; } });
Object.defineProperty(exports, "getUnsafeAiOutboundUrlReason", { enumerable: true, get: function () { return ssrf_1.getUnsafeAiOutboundUrlReason; } });
Object.defineProperty(exports, "getUnsafeAiProviderBaseUrlReason", { enumerable: true, get: function () { return ssrf_1.getUnsafeAiProviderBaseUrlReason; } });
Object.defineProperty(exports, "isPrivateAiProviderBaseUrlAllowed", { enumerable: true, get: function () { return ssrf_1.isPrivateAiProviderBaseUrlAllowed; } });
Object.defineProperty(exports, "isPrivateAiProviderEndpointAllowed", { enumerable: true, get: function () { return ssrf_1.isPrivateAiProviderEndpointAllowed; } });
Object.defineProperty(exports, "isSafeAiProviderBaseUrl", { enumerable: true, get: function () { return ssrf_1.isSafeAiProviderBaseUrl; } });
Object.defineProperty(exports, "isSsrfBlockedError", { enumerable: true, get: function () { return ssrf_1.isSsrfBlockedError; } });
Object.defineProperty(exports, "ssrfSafeFetch", { enumerable: true, get: function () { return ssrf_1.ssrfSafeFetch; } });
var base_url_validator_1 = require("./lib/credentials/base-url.validator");
Object.defineProperty(exports, "IsSafeAiProviderBaseUrl", { enumerable: true, get: function () { return base_url_validator_1.IsSafeAiProviderBaseUrl; } });
Object.defineProperty(exports, "assertSafeAiProviderBaseUrl", { enumerable: true, get: function () { return base_url_validator_1.assertSafeAiProviderBaseUrl; } });
// BYOK credentials
var ai_provider_credential_entity_1 = require("./lib/credentials/ai-provider-credential.entity");
Object.defineProperty(exports, "AiProviderCredential", { enumerable: true, get: function () { return ai_provider_credential_entity_1.AiProviderCredential; } });
var ai_provider_credential_service_1 = require("./lib/credentials/ai-provider-credential.service");
Object.defineProperty(exports, "AiProviderCredentialService", { enumerable: true, get: function () { return ai_provider_credential_service_1.AiProviderCredentialService; } });
var ai_provider_credential_module_1 = require("./lib/credentials/ai-provider-credential.module");
Object.defineProperty(exports, "AiProviderCredentialModule", { enumerable: true, get: function () { return ai_provider_credential_module_1.AiProviderCredentialModule; } });
// Chat attachments — the event `@gauzy/plugin-docs` captures into the Documents hub.
// 🛑 `AiChatAttachmentSavedEvent` is resolved BY NAME at runtime by that plugin's
// `ChatCaptureSubscriber`; removing or renaming this export silently disables chat capture.
var ai_chat_attachment_event_1 = require("./lib/attachments/ai-chat-attachment.event");
Object.defineProperty(exports, "AiChatAttachmentSavedEvent", { enumerable: true, get: function () { return ai_chat_attachment_event_1.AiChatAttachmentSavedEvent; } });
var ai_chat_attachment_service_1 = require("./lib/attachments/ai-chat-attachment.service");
Object.defineProperty(exports, "AiChatAttachmentService", { enumerable: true, get: function () { return ai_chat_attachment_service_1.AiChatAttachmentService; } });
Object.defineProperty(exports, "MAX_ATTACHMENT_BYTES", { enumerable: true, get: function () { return ai_chat_attachment_service_1.MAX_ATTACHMENT_BYTES; } });
// Chat history (per-user conversations)
var ai_chat_conversation_entity_1 = require("./lib/conversations/ai-chat-conversation.entity");
Object.defineProperty(exports, "AiChatConversation", { enumerable: true, get: function () { return ai_chat_conversation_entity_1.AiChatConversation; } });
var ai_chat_conversation_service_1 = require("./lib/conversations/ai-chat-conversation.service");
Object.defineProperty(exports, "AiChatConversationService", { enumerable: true, get: function () { return ai_chat_conversation_service_1.AiChatConversationService; } });
var ai_chat_conversation_module_1 = require("./lib/conversations/ai-chat-conversation.module");
Object.defineProperty(exports, "AiChatConversationModule", { enumerable: true, get: function () { return ai_chat_conversation_module_1.AiChatConversationModule; } });
//# sourceMappingURL=index.js.map