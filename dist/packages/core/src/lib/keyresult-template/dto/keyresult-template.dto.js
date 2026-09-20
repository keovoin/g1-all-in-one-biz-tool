"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyresultTemplateDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class KeyresultTemplateDTO {
}
exports.KeyresultTemplateDTO = KeyresultTemplateDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], KeyresultTemplateDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.KeyResultTypeEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.KeyResultTypeEnum),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], KeyresultTemplateDTO.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], KeyresultTemplateDTO.prototype, "unit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], KeyresultTemplateDTO.prototype, "targetValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], KeyresultTemplateDTO.prototype, "initialValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.KeyResultDeadlineEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.KeyResultDeadlineEnum),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], KeyresultTemplateDTO.prototype, "deadline", void 0);
//# sourceMappingURL=keyresult-template.dto.js.map