"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncludeTeamsDTO = void 0;
const tslib_1 = require("tslib");
// include-teams.dto.ts
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class IncludeTeamsDTO {
}
exports.IncludeTeamsDTO = IncludeTeamsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], IncludeTeamsDTO.prototype, "includeTeams", void 0);
//# sourceMappingURL=include-teams.dto.js.map