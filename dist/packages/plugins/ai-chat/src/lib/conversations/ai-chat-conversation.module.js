"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatConversationModule = void 0;
const tslib_1 = require("tslib");
const nestjs_1 = require("@mikro-orm/nestjs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@gauzy/core");
const ai_chat_conversation_entity_1 = require("./ai-chat-conversation.entity");
const ai_chat_conversation_controller_1 = require("./ai-chat-conversation.controller");
const ai_chat_conversation_service_1 = require("./ai-chat-conversation.service");
const type_orm_ai_chat_conversation_repository_1 = require("./repositories/type-orm-ai-chat-conversation.repository");
/**
 * AiChatConversationModule
 *
 * Persistence + REST endpoints for per-user AI chat conversation history.
 * Exports {@link AiChatConversationService} for the chat engine (which
 * calls `saveTurn` from stream-finished callbacks with an explicit
 * tenant/user scope — see the service JSDoc).
 */
let AiChatConversationModule = class AiChatConversationModule {
};
exports.AiChatConversationModule = AiChatConversationModule;
exports.AiChatConversationModule = AiChatConversationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [ai_chat_conversation_controller_1.AiChatConversationController],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ai_chat_conversation_entity_1.AiChatConversation]),
            nestjs_1.MikroOrmModule.forFeature([ai_chat_conversation_entity_1.AiChatConversation]),
            core_1.RolePermissionModule
        ],
        providers: [ai_chat_conversation_service_1.AiChatConversationService, type_orm_ai_chat_conversation_repository_1.TypeOrmAiChatConversationRepository],
        exports: [ai_chat_conversation_service_1.AiChatConversationService]
    })
], AiChatConversationModule);
//# sourceMappingURL=ai-chat-conversation.module.js.map