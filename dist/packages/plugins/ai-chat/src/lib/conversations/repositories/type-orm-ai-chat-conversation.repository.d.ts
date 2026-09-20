import { Repository } from 'typeorm';
import { AiChatConversation } from '../ai-chat-conversation.entity';
export declare class TypeOrmAiChatConversationRepository extends Repository<AiChatConversation> {
    readonly repository: Repository<AiChatConversation>;
    constructor(repository: Repository<AiChatConversation>);
}
