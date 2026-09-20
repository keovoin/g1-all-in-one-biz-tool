"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crypto_1 = require("crypto");
const multer_1 = require("multer");
const path = require("path");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const ai_chat_service_1 = require("./ai-chat.service");
const ai_chat_attachment_service_1 = require("./attachments/ai-chat-attachment.service");
/**
 * Object-name extensions a static file server would render in the browser (mirrors the Documents
 * upload endpoint). The stored object carries a neutral extension instead; the client keeps the
 * real type via `mimeType`.
 */
/**
 * Per-request storage engine of the attachment endpoint.
 *
 * Keys land under `ai-chat/<tenantId>/<organizationId>/` with a SERVER-GENERATED object name —
 * the client filename never enters the key, and the extension is stripped down to alphanumerics.
 * Mirrors the Documents upload endpoint, which is the other place user-supplied files are stored.
 */
const attachmentsStorage = (ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const tenantId = core_1.RequestContext.currentTenantId() || (0, crypto_1.randomUUID)();
    const rawOrganizationId = request?.headers?.['organization-id'] || (0, crypto_1.randomUUID)();
    // Path-sanitize: ids are UUIDs, but never trust a header verbatim.
    const organizationId = String(rawOrganizationId).replace(/[^a-zA-Z0-9-]/g, '') || (0, crypto_1.randomUUID)();
    return new core_1.FileStorage().storage({
        dest: () => path.join('ai-chat', tenantId, organizationId),
        prefix: 'ai-chat',
        filename: (_file, extension) => {
            const storedExtension = (0, core_1.toSafeStorageExtension)(extension);
            if (!storedExtension) {
                return `${(0, crypto_1.randomUUID)()}`;
            }
            // Never let a browser-renderable extension onto the stored object name — same rule as the
            // Documents upload endpoint (the LOCAL provider serves /public/<key> with a Content-Type
            // derived from the extension; the canonical type travels in the attachment's mimeType).
            return `${(0, crypto_1.randomUUID)()}.${storedExtension}`;
        }
    });
};
let AiChatController = class AiChatController {
    constructor(aiChatService, attachmentService) {
        this.aiChatService = aiChatService;
        this.attachmentService = attachmentService;
    }
    /**
     * Stream one chat turn as a Vercel AI SDK UI message stream (SSE).
     * The agent's API tools run with the caller's own JWT — the agent can
     * only see and do what the calling user is permitted to.
     */
    async chat(body, request, response, languageCode) {
        await this.aiChatService.streamChat({
            messages: body?.messages,
            providerId: body?.providerId,
            modelId: body?.modelId,
            conversationId: body?.conversationId,
            authorizationHeader: request.headers.authorization ?? '',
            languageCode,
            response
        });
    }
    /**
     * Runtime configuration for the current tenant: registered providers,
     * their models, configuration status and defaults. No secrets.
     *
     * Accessible with EITHER `AI_CHAT_ACCESS` (the chat surfaces need it) OR
     * `AI_CHAT_SETTINGS` (the BYOK "AI Providers" settings page needs it) —
     * overriding the controller-wide `AI_CHAT_ACCESS`. Without this, a tenant
     * admin granted only `AI_CHAT_SETTINGS` could open the settings page but got
     * a 403 here, blanking the whole page. The payload exposes no secrets.
     */
    async config() {
        return this.aiChatService.getConfig();
    }
    /**
     * Speech to text for the chat's dictation control.
     *
     * `AI_CHAT_ACCESS` only: dictation is a way of typing a message, so anyone who may use the chat
     * may dictate into it. Requiring AI_CHAT_SETTINGS here would gate an input method behind an
     * administrative permission.
     *
     * The size cap is the real guard — audio is user-supplied and would otherwise be bounded only by
     * how long someone holds the button. 25 MB matches what the upstream speech APIs accept, so a
     * larger upload could never have succeeded anyway.
     */
    async transcribe(file, body) {
        // Optional language hint (ISO-639-1 / BCP-47), sanitized to the tag grammar: it travels into a
        // provider request as a form field, so anything else is dropped rather than forwarded.
        const language = typeof body?.language === 'string' && /^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i.test(body.language)
            ? body.language
            : undefined;
        const text = await this.aiChatService.transcribe(file?.buffer, file?.mimetype ?? 'audio/webm', {
            ...(language ? { language } : {})
        });
        return { text };
    }
    /**
     * Attach a file to a chat conversation.
     *
     * The bytes are streamed straight into the configured `FileStorage` provider (never buffered
     * in memory — unlike dictation, which forwards the audio upstream and so must hold it), and
     * the save is announced as `AiChatAttachmentSavedEvent`. `@gauzy/plugin-docs` subscribes to
     * that event and turns the attachment into a `Document { source: CHAT }`, after which the
     * chat's own `docs_search` / `docs_read` tools can read it. Installs without that plugin
     * simply have no subscriber.
     *
     * `AI_CHAT_ACCESS` only, for the same reason as dictation: attaching a file is part of
     * composing a message, not an administrative act.
     */
    async attach(file, body) {
        return this.attachmentService.save(file, body?.conversationId);
    }
    /**
     * One provider's model catalogue, for the settings model picker.
     *
     * Separate from `/config` on purpose. `/config` is fetched at app bootstrap for every user with
     * chat access and loops every registered provider; fetching six upstream catalogues there would
     * put the app shell behind third-party APIs on every login. This is called lazily, for the one
     * provider whose config view was opened.
     *
     * Same two-permission rule as `/config`: an admin holding only AI_CHAT_SETTINGS must be able to
     * use the settings page. Exposes no secrets — model ids and labels only.
     */
    async providerModels(providerId) {
        return this.aiChatService.listProviderModels(providerId);
    }
};
exports.AiChatController = AiChatController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'AI agent chat — streams a Vercel AI SDK UI message stream' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'UI message stream (text/event-stream).' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid messages payload.' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'AI chat is not configured (no provider credentials).' }),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__param(3, (0, common_1.Headers)('language')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AiChatController.prototype, "chat", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'AI chat runtime configuration for the current tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI chat configuration.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.AI_CHAT_ACCESS, contracts_1.PermissionsEnum.AI_CHAT_SETTINGS),
    (0, common_1.Get)('/config'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AiChatController.prototype, "config", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Transcribe recorded speech' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transcript.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No audio uploaded.' })
    // multer's LIMIT_FILE_SIZE surfaces as PayloadTooLargeException via transformException.
    ,
    (0, swagger_1.ApiResponse)({ status: 413, description: 'Recording exceeds the 25 MB limit.' }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'No provider available to transcribe, or every attempt failed. Body: `{ message, code, settingsPath }` where `code` is an `AiSpeechErrorCode`.'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.AI_CHAT_ACCESS),
    (0, common_1.Post)('/transcribe'),
    (0, common_1.UseInterceptors)((0, core_1.LazyFileInterceptor)('file', {
        // Memory specifically: the handler reads `file.buffer`, which only memoryStorage populates.
        // A disk/FileStorage factory would leave it undefined and the service would then reject the
        // upload as empty — the audio never touches disk, it is forwarded straight upstream.
        //
        // (`storage` being omitted entirely is what broke this endpoint originally. It is now
        // required by LazyFileInterceptor's own signature, so that mistake no longer compiles.)
        storage: () => (0, multer_1.memoryStorage)(),
        // The same constant the service checks — declared here too so an oversized upload is
        // rejected by multer BEFORE memoryStorage buffers all of it in RAM. The service check
        // remains as the second line of defense (and covers callers that bypass this route).
        // Forwarding `limits` at all is part of this change; declaring it earlier would have
        // silently held nothing.
        limits: { fileSize: ai_chat_service_1.MAX_AUDIO_BYTES }
    })),
    tslib_1.__param(0, (0, common_1.UploadedFile)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AiChatController.prototype, "transcribe", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Attach a file to a chat conversation' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The stored attachment descriptor.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No file uploaded, or no organization scope.' })
    // multer's LIMIT_FILE_SIZE surfaces as PayloadTooLargeException via transformException.
    ,
    (0, swagger_1.ApiResponse)({ status: 413, description: 'Attachment exceeds the 25 MB limit.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.AI_CHAT_ACCESS),
    (0, common_1.Post)('/attachments'),
    (0, common_1.UseInterceptors)((0, core_1.LazyFileInterceptor)('file', {
        storage: (ctx) => attachmentsStorage(ctx),
        // Documents of (almost) any type are ingested here, so no allowlist — but script-capable
        // non-document types (.svg, .xhtml, .mhtml, .hta, .js, ...) have no business being stored
        // under /public with the client's extension.
        fileFilter: core_1.documentUploadFileFilter,
        // The same constant the service's cap derives from, declared here so an oversized
        // upload is rejected by multer BEFORE the provider stores any of it.
        limits: { fileSize: ai_chat_attachment_service_1.MAX_ATTACHMENT_BYTES }
    })),
    tslib_1.__param(0, (0, core_1.UploadedFileStorage)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AiChatController.prototype, "attach", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "A provider's available models" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Model catalogue.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Unknown provider.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.AI_CHAT_ACCESS, contracts_1.PermissionsEnum.AI_CHAT_SETTINGS),
    (0, common_1.Get)('/providers/:providerId/models'),
    tslib_1.__param(0, (0, common_1.Param)('providerId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AiChatController.prototype, "providerModels", null);
exports.AiChatController = AiChatController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('AI Chat'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.AI_CHAT_ACCESS),
    (0, common_1.Controller)('/ai-chat'),
    tslib_1.__metadata("design:paramtypes", [ai_chat_service_1.AiChatService,
        ai_chat_attachment_service_1.AiChatAttachmentService])
], AiChatController);
//# sourceMappingURL=ai-chat.controller.js.map