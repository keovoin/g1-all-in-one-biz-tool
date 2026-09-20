"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePreferredComponentLayoutDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
class UpdatePreferredComponentLayoutDTO {
}
exports.UpdatePreferredComponentLayoutDTO = UpdatePreferredComponentLayoutDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.ComponentLayoutStyleEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.ComponentLayoutStyleEnum),
    tslib_1.__metadata("design:type", String)
], UpdatePreferredComponentLayoutDTO.prototype, "preferredComponentLayout", void 0);
//# sourceMappingURL=update-preferred-component-layout.dto.js.map