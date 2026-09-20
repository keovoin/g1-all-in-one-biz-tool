"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicOrganizationQueryDTO = exports.OrganizationRelationEnum = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Get public organization request DTO validation
 */
var OrganizationRelationEnum;
(function (OrganizationRelationEnum) {
    OrganizationRelationEnum["image"] = "image";
    OrganizationRelationEnum["skills"] = "skills";
    OrganizationRelationEnum["awards"] = "awards";
    OrganizationRelationEnum["languages"] = "languages";
    OrganizationRelationEnum["languages.language"] = "languages.language";
})(OrganizationRelationEnum || (exports.OrganizationRelationEnum = OrganizationRelationEnum = {}));
class PublicOrganizationQueryDTO {
}
exports.PublicOrganizationQueryDTO = PublicOrganizationQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: OrganizationRelationEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(OrganizationRelationEnum, { each: true }),
    tslib_1.__metadata("design:type", Array)
], PublicOrganizationQueryDTO.prototype, "relations", void 0);
//# sourceMappingURL=public-organization-query.dto.js.map