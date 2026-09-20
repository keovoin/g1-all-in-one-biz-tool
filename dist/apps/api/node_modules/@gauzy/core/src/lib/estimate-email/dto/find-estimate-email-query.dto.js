"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindEstimateEmailQueryDTO = exports.EstimateEmailRelationEnum = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../shared/dto");
/**
 * Allowed relations for the estimate-email validation endpoint.
 *
 * Only relations whose columns are explicitly constrained by the service's
 * `select` clause are permitted.  Any relation not in this enum will be
 * rejected by class-validator.
 */
var EstimateEmailRelationEnum;
(function (EstimateEmailRelationEnum) {
    EstimateEmailRelationEnum["tenant"] = "tenant";
    EstimateEmailRelationEnum["organization"] = "organization";
})(EstimateEmailRelationEnum || (exports.EstimateEmailRelationEnum = EstimateEmailRelationEnum = {}));
/**
 * Find estimate email request DTO validation
 */
class FindEstimateEmailQueryDTO {
    constructor() {
        this.relations = [];
    }
}
exports.FindEstimateEmailQueryDTO = FindEstimateEmailQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], FindEstimateEmailQueryDTO.prototype, "email", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], FindEstimateEmailQueryDTO.prototype, "token", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: EstimateEmailRelationEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(dto_1.parseRelationsString),
    (0, class_validator_1.IsEnum)(EstimateEmailRelationEnum, { each: true }),
    tslib_1.__metadata("design:type", Array)
], FindEstimateEmailQueryDTO.prototype, "relations", void 0);
//# sourceMappingURL=find-estimate-email-query.dto.js.map