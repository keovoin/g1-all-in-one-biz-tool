"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubAppInstallDTO = exports.GithubInstallStateDTO = exports.GithubOAuthDTO = exports.GithubSetupActionEnum = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
/**
 *
 */
var GithubSetupActionEnum;
(function (GithubSetupActionEnum) {
    GithubSetupActionEnum["INSTALL"] = "install";
    GithubSetupActionEnum["UPDATE"] = "update";
})(GithubSetupActionEnum || (exports.GithubSetupActionEnum = GithubSetupActionEnum = {}));
/**
 *
 */
class GithubOAuthDTO extends core_1.TenantOrganizationBaseDTO {
}
exports.GithubOAuthDTO = GithubOAuthDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], GithubOAuthDTO.prototype, "code", void 0);
/**
 * Payload for minting a single-use, tenant-bound state nonce that starts a GitHub App
 * installation flow (see GithubOAuthStateService / GHSA-4rwq-65wh-45h4).
 */
class GithubInstallStateDTO extends core_1.TenantOrganizationBaseDTO {
}
exports.GithubInstallStateDTO = GithubInstallStateDTO;
/**
 *
 */
class GithubAppInstallDTO {
}
exports.GithubAppInstallDTO = GithubAppInstallDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], GithubAppInstallDTO.prototype, "installation_id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(GithubSetupActionEnum),
    tslib_1.__metadata("design:type", String)
], GithubAppInstallDTO.prototype, "setup_action", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[a-f0-9]{64}$/, { message: 'state must be a valid GitHub installation nonce' }),
    tslib_1.__metadata("design:type", String)
], GithubAppInstallDTO.prototype, "state", void 0);
//# sourceMappingURL=github-app-install.dto.js.map