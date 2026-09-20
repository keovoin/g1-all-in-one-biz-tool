"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubIssuesQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const core_1 = require("@gauzy/core");
class GithubIssuesQueryDTO extends core_1.TenantOrganizationBaseDTO {
}
exports.GithubIssuesQueryDTO = GithubIssuesQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => 'number', minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Transform)((params) => parseInt(params.value, 10)),
    tslib_1.__metadata("design:type", Number)
], GithubIssuesQueryDTO.prototype, "per_page", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => 'number', minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Transform)((params) => parseInt(params.value, 10)),
    tslib_1.__metadata("design:type", Number)
], GithubIssuesQueryDTO.prototype, "page", void 0);
//# sourceMappingURL=github-issues-query.dto.js.map