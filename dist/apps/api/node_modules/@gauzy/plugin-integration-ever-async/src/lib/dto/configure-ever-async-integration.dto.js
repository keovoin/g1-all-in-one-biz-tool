"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigureEverAsyncIntegrationDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const ever_async_user_mapping_dto_1 = require("./ever-async-user-mapping.dto");
class ConfigureEverAsyncIntegrationDto {
}
exports.ConfigureEverAsyncIntegrationDto = ConfigureEverAsyncIntegrationDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Public HTTPS URL of the Ever Async server', example: 'https://api-async.ever.co' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)({ protocols: ['https'], require_protocol: true }),
    tslib_1.__metadata("design:type", String)
], ConfigureEverAsyncIntegrationDto.prototype, "serverUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ever_async_user_mapping_dto_1.EverAsyncUserMappingDto] }),
    (0, class_validator_1.ValidateIf)((_object, value) => value !== undefined),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(1000),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ever_async_user_mapping_dto_1.EverAsyncUserMappingDto),
    tslib_1.__metadata("design:type", Array)
], ConfigureEverAsyncIntegrationDto.prototype, "userMappings", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Projects whose tasks may be read. Empty means no tasks.', type: [String] }),
    (0, class_validator_1.ValidateIf)((_object, value) => value !== undefined),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(1000),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], ConfigureEverAsyncIntegrationDto.prototype, "projectIds", void 0);
//# sourceMappingURL=configure-ever-async-integration.dto.js.map