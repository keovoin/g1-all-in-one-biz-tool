"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyPluginDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VerifyPluginDTO {
}
exports.VerifyPluginDTO = VerifyPluginDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the plugin version',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'versionId must be a valid UUID v4' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'versionId is required' }),
    tslib_1.__metadata("design:type", String)
], VerifyPluginDTO.prototype, "versionId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Digital signature for verifying the plugin',
        example: 'a1b2c3d4e5f6...'
    }),
    (0, class_validator_1.IsString)({ message: 'signature must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'signature is required' }),
    (0, class_validator_1.Length)(64, 512, { message: 'signature must be between 64 and 512 characters' }),
    tslib_1.__metadata("design:type", String)
], VerifyPluginDTO.prototype, "signature", void 0);
//# sourceMappingURL=verify-plugin.dto.js.map