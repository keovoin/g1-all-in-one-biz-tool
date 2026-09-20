"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessGithubIssueSyncDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
/**
 * Data Transfer Object for processing GitHub issue synchronization.
 *
 * This DTO provides optional properties to handle GitHub issues and repositories during synchronization.
 */
class ProcessGithubIssueSyncDTO extends core_1.TenantOrganizationBaseDTO {
}
exports.ProcessGithubIssueSyncDTO = ProcessGithubIssueSyncDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], ProcessGithubIssueSyncDTO.prototype, "issues", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], ProcessGithubIssueSyncDTO.prototype, "repository", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], ProcessGithubIssueSyncDTO.prototype, "projectId", void 0);
//# sourceMappingURL=process-github-issue-sync.dto.js.map