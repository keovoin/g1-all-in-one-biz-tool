"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrganizationDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const organization_entity_1 = require("./../organization.entity");
const organization_bonuses_dto_1 = require("./organization-bonuses.dto");
const organization_setting_dto_1 = require("./organization-setting.dto");
const dto_1 = require("./../../tags/dto");
/**
 * Organization Create DTO validation
 *
 */
class CreateOrganizationDTO extends (0, swagger_1.IntersectionType)(organization_bonuses_dto_1.OrganizationBonusesDTO, organization_setting_dto_1.OrganizationSettingDTO, (0, swagger_1.PickType)(organization_entity_1.Organization, ['name', 'imageId', 'standardWorkHoursPerDay']), (0, swagger_1.PickType)(organization_entity_1.Organization, ['upworkOrganizationId', 'upworkOrganizationName']), dto_1.RelationalTagDTO) {
}
exports.CreateOrganizationDTO = CreateOrganizationDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        enum: contracts_1.CurrenciesEnum,
        example: contracts_1.CurrenciesEnum.USD,
        required: true
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.CurrenciesEnum),
    tslib_1.__metadata("design:type", String)
], CreateOrganizationDTO.prototype, "currency", void 0);
//# sourceMappingURL=create-organization.dto.js.map