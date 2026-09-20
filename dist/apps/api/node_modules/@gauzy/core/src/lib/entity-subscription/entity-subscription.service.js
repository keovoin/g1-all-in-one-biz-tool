"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitySubscriptionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const context_1 = require("../core/context");
const mikro_orm_entity_subscription_repository_1 = require("./repository/mikro-orm-entity-subscription.repository");
const type_orm_entity_subscription_repository_1 = require("./repository/type-orm-entity-subscription.repository");
let EntitySubscriptionService = class EntitySubscriptionService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmEntitySubscriptionRepository, mikroOrmEntitySubscriptionRepository) {
        super(typeOrmEntitySubscriptionRepository, mikroOrmEntitySubscriptionRepository);
        this.typeOrmEntitySubscriptionRepository = typeOrmEntitySubscriptionRepository;
        this.mikroOrmEntitySubscriptionRepository = mikroOrmEntitySubscriptionRepository;
    }
    /**
     * Creates a new subscription for the specified entity and user.
     *
     * @param {IEntitySubscriptionCreateInput} input - The input object containing subscription details, including the entity type, entity ID, and optional tenant ID.
     * @returns {Promise<IEntitySubscription>} A promise resolving to the created subscription, or the existing subscription if it already exists.
     * @throws {BadRequestException} Throws a BadRequestException if the subscription creation fails due to an error.
     */
    async create(input) {
        try {
            // Extract the tenant ID from the request context
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // Extract the user from the request context
            const user = context_1.RequestContext.currentUser();
            // Extract the employee ID from the user
            const employeeId = user.employeeId;
            // Extract the entity ID and type from the input
            const { entity, entityId, organizationId } = input;
            // Check if the subscription already exists
            try {
                const entitySubscription = await this.findOneByOptions({
                    where: { employeeId, entity, entityId, organizationId, tenantId }
                });
                if (entitySubscription) {
                    return entitySubscription;
                }
            }
            catch (e) { }
            // Create a new subscription if none exists
            const subscription = await super.create({ ...input, employeeId, tenantId });
            /**
             * TODO : Optional subscription notification if needed
             */
            return subscription;
        }
        catch (error) {
            console.log('Error creating subscription:', error);
            throw new common_1.BadRequestException('Failed to create subscription', error);
        }
    }
    /**
     * Unsubscribes a user from a specific entity by deleting the corresponding subscription.
     *
     * @param {ID} id - The unique identifier of the subscription to delete.
     * @param {IEntitySubscriptionFindInput} options - Additional options to refine the deletion query.
     *   - `entity`: The type of entity the subscription is associated with (e.g., "project").
     *   - `entityId`: The unique identifier of the associated entity.
     * @returns {Promise<DeleteResult>} A promise that resolves to the result of the delete operation.
     *
     * @throws {BadRequestException} Throws an exception if an error occurs during the unsubscribe process.
     */
    async unsubscribe(id, input) {
        try {
            // Extract the tenant ID from the request context
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // Extract the user from the request context
            const user = context_1.RequestContext.currentUser();
            // Extract the employee ID from the user
            const employeeId = user.employeeId;
            // Extract the entity ID and type from the input
            const { entity, entityId, organizationId } = input;
            // Delete the subscription
            return await super.delete(id, {
                where: {
                    entity,
                    entityId,
                    employeeId,
                    organizationId,
                    tenantId
                }
            });
        }
        catch (error) {
            console.log(`Error unsubscribing employee from entity: ${error}`);
            throw new common_1.BadRequestException('Failed to unsubscribing employee from entity', error);
        }
    }
};
exports.EntitySubscriptionService = EntitySubscriptionService;
exports.EntitySubscriptionService = EntitySubscriptionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_entity_subscription_repository_1.TypeOrmEntitySubscriptionRepository,
        mikro_orm_entity_subscription_repository_1.MikroOrmEntitySubscriptionRepository])
], EntitySubscriptionService);
//# sourceMappingURL=entity-subscription.service.js.map