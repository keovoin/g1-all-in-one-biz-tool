"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartTimerDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./../../../core/dto");
const time_log_entity_1 = require("../../time-log/time-log.entity");
class StartTimerDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)(time_log_entity_1.TimeLog, [
    'source',
    'logType',
    'isBillable',
    'description',
    'version',
    'organizationTeamId',
    'organizationContactId',
    'projectId',
    'taskId'
])) {
}
exports.StartTimerDTO = StartTimerDTO;
//# sourceMappingURL=start-timer.dto.js.map