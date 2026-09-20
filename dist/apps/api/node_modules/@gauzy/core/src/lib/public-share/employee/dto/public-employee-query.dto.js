"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicEmployeeQueryDTO = exports.EmployeeRelationEnum = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * Get public employee request DTO validation
 */
var EmployeeRelationEnum;
(function (EmployeeRelationEnum) {
    EmployeeRelationEnum["user"] = "user";
    EmployeeRelationEnum["user.image"] = "user.image";
    EmployeeRelationEnum["organizationEmploymentTypes"] = "organizationEmploymentTypes";
    EmployeeRelationEnum["organizationPosition"] = "organizationPosition";
    EmployeeRelationEnum["skills"] = "skills";
    EmployeeRelationEnum["awards"] = "awards";
})(EmployeeRelationEnum || (exports.EmployeeRelationEnum = EmployeeRelationEnum = {}));
class PublicEmployeeQueryDTO {
}
exports.PublicEmployeeQueryDTO = PublicEmployeeQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: EmployeeRelationEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value) ? value.map((element) => element.trim()) : {}),
    (0, class_validator_1.IsEnum)(EmployeeRelationEnum, { each: true }),
    tslib_1.__metadata("design:type", Array)
], PublicEmployeeQueryDTO.prototype, "relations", void 0);
//# sourceMappingURL=public-employee-query.dto.js.map