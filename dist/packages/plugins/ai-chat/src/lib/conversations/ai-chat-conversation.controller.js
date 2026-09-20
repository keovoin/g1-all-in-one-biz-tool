"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatConversationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const ai_chat_conversation_service_1 = require("./ai-chat-conversation.service");
/**
 * Per-user AI chat conversation history endpoints.
 *
 * All routes require the `AI_CHAT_ACCESS` permission (every chat user
 * manages their OWN history — no admin permission needed) and operate
 * strictly on `RequestContext.currentUserId()`: a user can only ever
 * list, read, or delete conversations they own, within their tenant.
 */
let AiChatConversationController = class AiChatConversationController {
    constructor(aiChatConversationService) {
        this.aiChatConversationService = aiChatConversationService;
    }
    /**
     * List the current user's conversations (newest first). Transcripts are
     * not included — only id, title, and last-update time.
     *
     * @returns Conversation summaries for the current user.
     */
    async findAll() {
        return await this.aiChatConversationService.listForUser(core_1.RequestContext.currentUserId(), core_1.RequestContext.currentTenantId());
    }
    /**
     * Load one of the current user's conversations, including the parsed
     * message transcript.
     *
     * @param id - The UUID of the conversation to load.
     * @returns The conversation with its parsed `UIMessage[]` transcript.
     */
    async findById(id) {
        const conversation = await this.aiChatConversationService.getForUser(id, core_1.RequestContext.currentUserId(), core_1.RequestContext.currentTenantId());
        if (!conversation) {
            throw new common_1.NotFoundException(`Conversation '${id}' was not found`);
        }
        return conversation;
    }
    /**
     * Delete one of the current user's conversations.
     *
     * @param id - The UUID of the conversation to delete.
     */
    async delete(id) {
        const deleted = await this.aiChatConversationService.deleteForUser(id, core_1.RequestContext.currentUserId(), core_1.RequestContext.currentTenantId());
        if (!deleted) {
            throw new common_1.NotFoundException(`Conversation '${id}' was not found`);
        }
    }
};
exports.AiChatConversationController = AiChatConversationController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "List the current user's AI chat conversations (id, title, updatedAt)." }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Conversations retrieved successfully.' }),
    (0, common_1.Get)('/'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AiChatConversationController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get one of the current user's AI chat conversations, with messages." }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Conversation retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Record not found' }),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AiChatConversationController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete one of the current user's AI chat conversations." }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT, description: 'The conversation has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Record not found' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AiChatConversationController.prototype, "delete", null);
exports.AiChatConversationController = AiChatConversationController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('AI Chat Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.AI_CHAT_ACCESS),
    (0, common_1.Controller)('/ai-chat/conversations'),
    tslib_1.__metadata("design:paramtypes", [ai_chat_conversation_service_1.AiChatConversationService])
], AiChatConversationController);
//# sourceMappingURL=ai-chat-conversation.controller.js.map