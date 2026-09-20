"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubscriptionHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const entity_subscription_create_event_1 = require("../entity-subscription.create.event");
const commands_1 = require("../../commands");
let CreateSubscriptionHandler = class CreateSubscriptionHandler {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    /**
     * Handles a subscription creation event.
     *
     * Extracts subscription details from the event input and uses the command bus to execute a EntitySubscriptionCreateCommand,
     * which creates a new subscription for the specified entity.
     *
     * @param {CreateEntitySubscriptionEvent} event - The event containing the input data for subscription creation.
     * @returns {Promise<IEntitySubscription>} A promise that resolves to the created subscription.
     * @throws An error if the subscription creation process fails.
     */
    async handle(event) {
        try {
            // Retrieve the input data from the event.
            const { entity, entityId, employeeId, type, organizationId, tenantId } = event.input;
            // Execute the subscription creation command.
            const subscription = await this.commandBus.execute(new commands_1.EntitySubscriptionCreateCommand({
                entity,
                entityId,
                employeeId,
                type,
                organizationId,
                tenantId
            }));
            return subscription;
        }
        catch (error) {
            console.log(`Error while creating subscription: ${error.message}`, error);
            // Re-throw the error with additional context
            throw new common_1.BadRequestException('Failed to create subscription', error);
        }
    }
};
exports.CreateSubscriptionHandler = CreateSubscriptionHandler;
exports.CreateSubscriptionHandler = CreateSubscriptionHandler = tslib_1.__decorate([
    (0, cqrs_1.EventsHandler)(entity_subscription_create_event_1.CreateEntitySubscriptionEvent),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus])
], CreateSubscriptionHandler);
//# sourceMappingURL=entity-subscription.create.handler.js.map