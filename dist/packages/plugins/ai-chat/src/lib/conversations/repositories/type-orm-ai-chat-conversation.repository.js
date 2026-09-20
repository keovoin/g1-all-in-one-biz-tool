"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmAiChatConversationRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ai_chat_conversation_entity_1 = require("../ai-chat-conversation.entity");
let TypeOrmAiChatConversationRepository = class TypeOrmAiChatConversationRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmAiChatConversationRepository = TypeOrmAiChatConversationRepository;
exports.TypeOrmAiChatConversationRepository = TypeOrmAiChatConversationRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(ai_chat_conversation_entity_1.AiChatConversation)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmAiChatConversationRepository);
//# sourceMappingURL=type-orm-ai-chat-conversation.repository.js.map