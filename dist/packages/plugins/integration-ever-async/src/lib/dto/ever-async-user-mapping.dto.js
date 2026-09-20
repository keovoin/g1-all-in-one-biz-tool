"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EverAsyncUserMappingDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/** A workspace-scoped chat identity mapped to an employee in this Gauzy organization. */
class EverAsyncUserMappingDto {
}
exports.EverAsyncUserMappingDto = EverAsyncUserMappingDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['slack', 'discord'] }),
    (0, class_validator_1.IsIn)(['slack', 'discord']),
    tslib_1.__metadata("design:type", String)
], EverAsyncUserMappingDto.prototype, "channel", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Verified Slack workspace ID or Discord server ID from Ever Async Connections' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[^\s]{1,200}$/),
    tslib_1.__metadata("design:type", String)
], EverAsyncUserMappingDto.prototype, "workspace", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Chat platform user id (e.g. a Slack member id)',
        example: 'U0123ABC'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    (0, class_validator_1.Matches)(/^[^\s]+$/),
    tslib_1.__metadata("design:type", String)
], EverAsyncUserMappingDto.prototype, "chatUserId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gauzy employee id the chat user maps to',
        example: 'b1f2c3d4-0000-0000-0000-000000000000'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], EverAsyncUserMappingDto.prototype, "employeeId", void 0);
//# sourceMappingURL=ever-async-user-mapping.dto.js.map