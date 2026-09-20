"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTenantDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const tenant_dto_1 = require("./tenant.dto");
class CreateTenantDTO extends tenant_dto_1.TenantDTO {
}
exports.CreateTenantDTO = CreateTenantDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreateTenantDTO.prototype, "isImporting", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreateTenantDTO.prototype, "sourceId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreateTenantDTO.prototype, "userSourceId", void 0);
//# sourceMappingURL=create-tenant.dto.js.map