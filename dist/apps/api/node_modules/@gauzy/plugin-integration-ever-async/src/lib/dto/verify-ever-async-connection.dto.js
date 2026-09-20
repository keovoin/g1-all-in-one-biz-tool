"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEverAsyncConnectionDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VerifyEverAsyncConnectionDto {
}
exports.VerifyEverAsyncConnectionDto = VerifyEverAsyncConnectionDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://api-async.ever.co' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)({ protocols: ['https'], require_protocol: true }),
    tslib_1.__metadata("design:type", String)
], VerifyEverAsyncConnectionDto.prototype, "serverUrl", void 0);
//# sourceMappingURL=verify-ever-async-connection.dto.js.map