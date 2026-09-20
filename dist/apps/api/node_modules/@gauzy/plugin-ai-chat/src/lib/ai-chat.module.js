"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const ai_chat_controller_1 = require("./ai-chat.controller");
const ai_chat_service_1 = require("./ai-chat.service");
const ai_chat_attachment_service_1 = require("./attachments/ai-chat-attachment.service");
const ai_provider_credential_module_1 = require("./credentials/ai-provider-credential.module");
const ai_chat_conversation_module_1 = require("./conversations/ai-chat-conversation.module");
let AiChatModule = class AiChatModule {
};
exports.AiChatModule = AiChatModule;
exports.AiChatModule = AiChatModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            core_1.RolePermissionModule,
            // Provides the core RxJS EventBus the attachment service publishes
            // `AiChatAttachmentSavedEvent` on (consumed by @gauzy/plugin-docs' chat capture).
            core_1.EventBusModule,
            ai_provider_credential_module_1.AiProviderCredentialModule,
            ai_chat_conversation_module_1.AiChatConversationModule
        ],
        controllers: [ai_chat_controller_1.AiChatController],
        providers: [ai_chat_service_1.AiChatService, ai_chat_attachment_service_1.AiChatAttachmentService],
        exports: [ai_chat_service_1.AiChatService, ai_chat_attachment_service_1.AiChatAttachmentService]
    })
], AiChatModule);
//# sourceMappingURL=ai-chat.module.js.map