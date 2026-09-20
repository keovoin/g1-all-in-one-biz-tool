"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePipelineDTO = exports.PipelineDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const internal_1 = require("../../core/entities/internal");
const dto_1 = require("../../core/dto");
/**
 * Pipeline DTO
 */
class PipelineDTO extends (0, mapped_types_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, mapped_types_1.PickType)(internal_1.Pipeline, ['name', 'description', 'stages', 'isActive', 'isArchived'])) {
}
exports.PipelineDTO = PipelineDTO;
/**
 * Create pipeline DTO
 */
class CreatePipelineDTO extends PipelineDTO {
}
exports.CreatePipelineDTO = CreatePipelineDTO;
//# sourceMappingURL=create-pipeline.dto.js.map