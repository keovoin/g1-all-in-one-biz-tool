"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const context_1 = require("../core/context");
const events_1 = require("../entity-subscription/events");
const type_orm_mention_repository_1 = require("./repository/type-orm-mention.repository");
const mikro_orm_mention_repository_1 = require("./repository/mikro-orm-mention.repository");
const events_2 = require("./events");
const employee_notification_service_1 = require("../employee-notification/employee-notification.service");
let MentionService = class MentionService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmMentionRepository, mikroOrmMentionRepository, _eventBus, _employeeNotificationService) {
        super(typeOrmMentionRepository, mikroOrmMentionRepository);
        this.typeOrmMentionRepository = typeOrmMentionRepository;
        this.mikroOrmMentionRepository = mikroOrmMentionRepository;
        this._eventBus = _eventBus;
        this._employeeNotificationService = _employeeNotificationService;
    }
    /**
     * Creates a new mention entity in the database.
     *
     * @param {IMentionCreateInput} input - The data required to create a new mention entity.
     * @returns {Promise<IMention>} A promise that resolves to the newly created mention entity.
     * @throws {BadRequestException} If an error occurs during the creation process,
     *   a `BadRequestException` is thrown with a descriptive message and the original error.
     */
    async create(input) {
        try {
            // Retrieve currently logged-in user
            const user = context_1.RequestContext.currentUser();
            // Get the tenant ID from the current request context or use the one from the entity
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            const { entity, entityId, parentEntityId, parentEntityType, mentionedEmployeeId, organizationId, entityName } = input;
            // Create the mention entry using the provided input along with the tenantId and mentionedEmployeeId.
            const mention = await super.create({
                ...input,
                mentionedEmployeeId,
                organizationId,
                tenantId,
                employeeId: user.employeeId
            });
            // Create an user subscription for provided entity
            this._eventBus.publish(new events_1.CreateEntitySubscriptionEvent({
                entity: parentEntityType ?? entity,
                entityId: parentEntityId ?? entityId,
                employeeId: user.employeeId,
                type: contracts_1.EntitySubscriptionTypeEnum.MENTION,
                organizationId,
                tenantId
            }));
            // Trigger internal system notification for mentioned user
            this._employeeNotificationService.publishNotificationEvent({
                entity: parentEntityType ?? entity,
                entityId: parentEntityId ?? entityId,
                type: contracts_1.EmployeeNotificationTypeEnum.MENTION,
                organizationId,
                tenantId
            }, contracts_1.NotificationActionTypeEnum.Mentioned, entityName, user.name);
            /**
             * TODO
             * 1. Send email notifications for both mention and optional subscription
             */
            // Return the created mention.
            return mention;
        }
        catch (error) {
            console.log('Error while creating mention:', error);
            throw new common_1.BadRequestException('Error while creating mention', error);
        }
    }
    /**
     * Publishes a `MentionEvent` to the event bus.
     *
     * @param {IMentionCreateInput} input - The input data required to create a new mention.
     *
     */
    publishMention(input) {
        this._eventBus.publish(new events_2.CreateMentionEvent(input));
    }
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
    async updateEntityMentions(entity, entityId, mentionEmployeeIds, parentEntityId, parentEntityType) {
        try {
            const user = context_1.RequestContext.currentUser();
            // Retrieve existing mentions for the entity
            const existingMentions = await super.find({
                where: { entity, entityId },
                select: { mentionedEmployeeId: true }
            });
            // Extract the IDs of currently mentioned users
            const existingMentionEmployeeIds = new Set(existingMentions.map((mention) => mention.mentionedEmployeeId));
            // Determine mentions to add (not present in existing mentions)
            const mentionsToAddEmployeeIds = mentionEmployeeIds.filter((id) => !existingMentionEmployeeIds.has(id));
            // Determine mentions to remove (present in existing mentions but not in mentionsIds)
            const mentionsToRemoveIds = [...existingMentionEmployeeIds].filter((id) => !mentionEmployeeIds.includes(id));
            // Add new mentions
            if (mentionsToAddEmployeeIds.length > 0) {
                await Promise.all(mentionsToAddEmployeeIds.map((mentionedEmployeeId) => this.publishMention({
                    entity: entity,
                    entityId,
                    parentEntityId,
                    parentEntityType,
                    mentionedEmployeeId,
                    actorType: contracts_1.ActorTypeEnum.User,
                    employeeId: user.employeeId
                })));
            }
            // Remove outdated mentions
            if (mentionsToRemoveIds.length > 0) {
                await super.delete({ mentionedEmployeeId: (0, typeorm_1.In)(mentionsToRemoveIds), entity, entityId });
            }
        }
        catch (error) {
            console.log(`Error while updating mention: ${error.message}`, error);
            throw new common_1.BadRequestException('Error while updating mention', error);
        }
    }
};
exports.MentionService = MentionService;
exports.MentionService = MentionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_mention_repository_1.TypeOrmMentionRepository,
        mikro_orm_mention_repository_1.MikroOrmMentionRepository,
        cqrs_1.EventBus,
        employee_notification_service_1.EmployeeNotificationService])
], MentionService);
//# sourceMappingURL=mention.service.js.map