"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationalGoalKpiTemplateDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RelationalGoalKpiTemplateDTO {
}
exports.RelationalGoalKpiTemplateDTO = RelationalGoalKpiTemplateDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], RelationalGoalKpiTemplateDTO.prototype, "kpi", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], RelationalGoalKpiTemplateDTO.prototype, "kpiId", void 0);
//# sourceMappingURL=relational-gloal-kpi-template.dto.js.map