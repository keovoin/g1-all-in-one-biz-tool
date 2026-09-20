"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitySubscriptionCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const entity_subscription_create_command_1 = require("../entity-subscription.create.command");
const entity_subscription_service_1 = require("../../entity-subscription.service");
let EntitySubscriptionCreateHandler = class EntitySubscriptionCreateHandler {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async execute(command) {
        const { input } = command;
        return await this.subscriptionService.create(input);
    }
};
exports.EntitySubscriptionCreateHandler = EntitySubscriptionCreateHandler;
exports.EntitySubscriptionCreateHandler = EntitySubscriptionCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(entity_subscription_create_command_1.EntitySubscriptionCreateCommand),
    tslib_1.__metadata("design:paramtypes", [entity_subscription_service_1.EntitySubscriptionService])
], EntitySubscriptionCreateHandler);
//# sourceMappingURL=entity-subscription.create.handler.js.map