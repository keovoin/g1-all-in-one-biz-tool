"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOfficialHolidayDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_official_holiday_dto_1 = require("./create-official-holiday.dto");
/**
 * Update Official Holiday request DTO.
 */
class UpdateOfficialHolidayDTO extends (0, swagger_1.PartialType)(create_official_holiday_dto_1.CreateOfficialHolidayDTO) {
}
exports.UpdateOfficialHolidayDTO = UpdateOfficialHolidayDTO;
//# sourceMappingURL=update-official-holiday.dto.js.map