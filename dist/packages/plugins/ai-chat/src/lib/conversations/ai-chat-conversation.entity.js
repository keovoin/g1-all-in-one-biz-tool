"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatConversation = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
const mikro_orm_ai_chat_conversation_repository_1 = require("./repositories/mikro-orm-ai-chat-conversation.repository");
/**
 * A persisted AI chat conversation for a single user.
 *
 * One row per conversation thread. Rows are scoped by tenant/organization
 * (via {@link TenantOrganizationBaseEntity}) AND by the owning `userId` —
 * a conversation is private to the user who created it, even within the
 * same tenant. `createdAt`/`updatedAt` come from the base entity.
 */
let AiChatConversation = class AiChatConversation extends core_1.TenantOrganizationBaseEntity {
};
exports.AiChatConversation = AiChatConversation;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Id of the user who owns this conversation' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'User id is required' }),
    (0, class_validator_1.IsUUID)(undefined, { message: 'User id must be a valid UUID' }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], AiChatConversation.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Conversation title' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    (0, class_validator_1.IsString)({ message: 'Title must be a string' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], AiChatConversation.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'JSON-serialized UIMessage[] transcript' }),
    (0, core_1.MultiORMColumn)({ type: 'text' }),
    tslib_1.__metadata("design:type", String)
], AiChatConversation.prototype, "messages", void 0);
exports.AiChatConversation = AiChatConversation = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('ai_chat_conversation', { mikroOrmRepository: () => mikro_orm_ai_chat_conversation_repository_1.MikroOrmAiChatConversationRepository })
], AiChatConversation);
//# sourceMappingURL=ai-chat-conversation.entity.js.map