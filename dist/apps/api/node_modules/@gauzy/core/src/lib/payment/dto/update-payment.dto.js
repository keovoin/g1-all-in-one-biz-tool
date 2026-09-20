"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const payment_dto_1 = require("./payment.dto");
/**
 * Update payment request DTO validation.
 */
class UpdatePaymentDTO extends (0, swagger_1.OmitType)(payment_dto_1.PaymentDTO, ['employee', 'employeeId']) {
}
exports.UpdatePaymentDTO = UpdatePaymentDTO;
//# sourceMappingURL=update-payment.dto.js.map