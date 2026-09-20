"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitySubscriptionFindInputDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const entity_subscription_entity_1 = require("../entity-subscription.entity");
const dto_1 = require("../../core/dto");
/**
 * Entity subscription find input DTO validation
 */
class EntitySubscriptionFindInputDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PartialType)(entity_subscription_entity_1.EntitySubscription)) {
}
exports.EntitySubscriptionFindInputDTO = EntitySubscriptionFindInputDTO;
//# sourceMappingURL=entity-subscription-find-input.dto.js.map