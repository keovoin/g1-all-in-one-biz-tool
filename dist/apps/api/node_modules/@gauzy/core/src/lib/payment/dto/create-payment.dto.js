"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const payment_dto_1 = require("./payment.dto");
/**
 * Create payment request DTO validation
 *
 */
class CreatePaymentDTO extends (0, mapped_types_1.IntersectionType)(payment_dto_1.PaymentDTO) {
}
exports.CreatePaymentDTO = CreatePaymentDTO;
//# sourceMappingURL=create-payment.dto.js.map