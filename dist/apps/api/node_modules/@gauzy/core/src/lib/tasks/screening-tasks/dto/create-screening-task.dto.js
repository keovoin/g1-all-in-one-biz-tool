"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateScreeningTaskDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../../core/dto");
const dto_2 = require("../../../mention/dto");
const screening_task_entity_1 = require("../screening-task.entity");
/**
 * Create Screening Task data validation request DTO
 */
class CreateScreeningTaskDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, dto_2.MentionEmployeeIdsDTO, (0, swagger_1.OmitType)(screening_task_entity_1.ScreeningTask, ['status'])) {
}
exports.CreateScreeningTaskDTO = CreateScreeningTaskDTO;
//# sourceMappingURL=create-screening-task.dto.js.map