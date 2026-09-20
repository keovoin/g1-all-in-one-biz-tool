"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./../../core/dto");
const payment_entity_1 = require("../payment.entity");
const dto_2 = require("../../employee/dto");
class PaymentDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PartialType)(dto_2.EmployeeFeatureDTO), (0, swagger_1.PickType)(payment_entity_1.Payment, [
    'amount',
    'paymentMethod',
    'paymentDate',
    'overdue',
    'note',
    'currency',
    'project',
    'projectId',
    'organizationContact',
    'organizationContactId',
    'invoice',
    'invoiceId',
    'tags'
])) {
}
exports.PaymentDTO = PaymentDTO;
//# sourceMappingURL=payment.dto.js.map