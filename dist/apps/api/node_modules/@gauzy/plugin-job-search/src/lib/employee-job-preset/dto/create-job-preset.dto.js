"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobPresetDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@gauzy/core");
/**
 * Data Transfer Object for creating job presets.
 */
class CreateJobPresetDTO extends (0, swagger_1.IntersectionType)(core_1.TenantOrganizationBaseDTO) {
}
exports.CreateJobPresetDTO = CreateJobPresetDTO;
//# sourceMappingURL=create-job-preset.dto.js.map