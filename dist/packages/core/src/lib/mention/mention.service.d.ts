import { EventBus } from '@nestjs/cqrs';
import { BaseEntityEnum, ID, IMention, IMentionCreateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { Mention } from './mention.entity';
import { TypeOrmMentionRepository } from './repository/type-orm-mention.repository';
import { MikroOrmMentionRepository } from './repository/mikro-orm-mention.repository';
import { EmployeeNotificationService } from '../employee-notification/employee-notification.service';
export declare class MentionService extends TenantAwareCrudService<Mention> {
    readonly typeOrmMentionRepository: TypeOrmMentionRepository;
    readonly mikroOrmMentionRepository: MikroOrmMentionRepository;
    private readonly _eventBus;
    private readonly _employeeNotificationService;
    constructor(typeOrmMentionRepository: TypeOrmMentionRepository, mikroOrmMentionRepository: MikroOrmMentionRepository, _eventBus: EventBus, _employeeNotificationService: EmployeeNotificationService);
    /**
     * Creates a new mention entity in the database.
     *
     * @param {IMentionCreateInput} input - The data required to create a new mention entity.
     * @returns {Promise<IMention>} A promise that resolves to the newly created mention entity.
     * @throws {BadRequestException} If an error occurs during the creation process,
     *   a `BadRequestException` is thrown with a descriptive message and the original error.
     */
    create(input: IMentionCreateInput): Promise<IMention>;
    /**
     * Publishes a `MentionEvent` to the event bus.
     *
     * @param {IMentionCreateInput} input - The input data required to create a new mention.
     *
     */
    publishMention(input: IMentionCreateInput): void;
    /**
     * Synchronize mentions for a given entity.
     *
     * This method handles adding new mentions and removing outdated mentions
     * for an entity (e.g., comments, tasks, or projects). It ensures that only
     * the specified user mentions (`newMentionEmployeeIds`) are associated with the entity.
     *
     * @param entity - The type of entity being updated (e.g., Comment, Task, etc.).
     * @param entityId - The ID of the entity being updated.
     * @param mentionEmployeeIds - Array of user IDs to be mentioned in this entity.
     * @param parentEntityId - (Optional) The ID of the parent entity, if applicable.
     * @param parentEntityType - (Optional) The type of the parent entity, if applicable.
     */
    updateEntityMentions(entity: BaseEntityEnum, entityId: ID, mentionEmployeeIds: ID[], parentEntityId?: ID, parentEntityType?: BaseEntityEnum): Promise<void>;
}
