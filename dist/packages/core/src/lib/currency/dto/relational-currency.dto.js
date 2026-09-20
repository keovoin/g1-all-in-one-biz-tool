"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationalCurrencyDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RelationalCurrencyDTO {
}
exports.RelationalCurrencyDTO = RelationalCurrencyDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.CurrenciesEnum, readOnly: true }),
    (0, class_validator_1.IsEnum)(contracts_1.CurrenciesEnum),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], RelationalCurrencyDTO.prototype, "currency", void 0);
//# sourceMappingURL=relational-currency.dto.js.map