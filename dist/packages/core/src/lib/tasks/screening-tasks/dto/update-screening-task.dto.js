"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateScreeningTaskDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../../core/dto");
const screening_task_entity_1 = require("../screening-task.entity");
/**
 * Update Screening Task data validation request DTO
 */
class UpdateScreeningTaskDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.OmitType)(screening_task_entity_1.ScreeningTask, ['task', 'taskId'])) {
}
exports.UpdateScreeningTaskDTO = UpdateScreeningTaskDTO;
//# sourceMappingURL=update-screening-task.dto.js.map