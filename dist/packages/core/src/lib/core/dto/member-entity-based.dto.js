"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberEntityBasedDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const tenant_organization_base_dto_1 = require("./tenant-organization-base.dto");
class MemberEntityBasedDTO extends tenant_organization_base_dto_1.TenantOrganizationBaseDTO {
    constructor() {
        super(...arguments);
        /**
         * Array of member UUIDs.
         */
        this.memberIds = [];
        /**
         * Array of manager UUIDs.
         */
        this.managerIds = [];
    }
}
exports.MemberEntityBasedDTO = MemberEntityBasedDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], MemberEntityBasedDTO.prototype, "memberIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], MemberEntityBasedDTO.prototype, "managerIds", void 0);
//# sourceMappingURL=member-entity-based.dto.js.map