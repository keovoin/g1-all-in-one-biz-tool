"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmailHistoryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
class UpdateEmailHistoryDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.UpdateEmailHistoryDTO = UpdateEmailHistoryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateEmailHistoryDTO.prototype, "isArchived", void 0);
//# sourceMappingURL=update-email-history.dto.js.map