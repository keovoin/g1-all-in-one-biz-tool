"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEntitySubscriptionDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("../../core");
const entity_subscription_entity_1 = require("../entity-subscription.entity");
/**
 * Create entity subscription data validation request DTO.
 */
class CreateEntitySubscriptionDTO extends (0, swagger_1.IntersectionType)(core_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)(entity_subscription_entity_1.EntitySubscription, ['type', 'actorType', 'entity', 'entityId'])) {
}
exports.CreateEntitySubscriptionDTO = CreateEntitySubscriptionDTO;
//# sourceMappingURL=create-entity-subscription.dto.js.map