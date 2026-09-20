"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlaneSettingsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const configure_plane_integration_dto_1 = require("./configure-plane-integration.dto");
/**
 * DTO for updating Plane integration settings.
 * All fields are optional (partial update).
 */
class UpdatePlaneSettingsDto extends (0, swagger_1.PartialType)(configure_plane_integration_dto_1.ConfigurePlaneIntegrationDto) {
}
exports.UpdatePlaneSettingsDto = UpdatePlaneSettingsDto;
//# sourceMappingURL=update-plane-settings.dto.js.map