"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOfficialHolidayDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./../../core/dto");
const official_holiday_entity_1 = require("../official-holiday.entity");
/**
 * Create Official Holiday request DTO.
 */
class CreateOfficialHolidayDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.OmitType)(official_holiday_entity_1.OfficialHoliday, ['organizationId', 'tenantId'])) {
}
exports.CreateOfficialHolidayDTO = CreateOfficialHolidayDTO;
//# sourceMappingURL=create-official-holiday.dto.js.map