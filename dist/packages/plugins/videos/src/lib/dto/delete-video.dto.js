"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteVideoDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DeleteVideoDTO {
}
exports.DeleteVideoDTO = DeleteVideoDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The ID of the video to delete', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], DeleteVideoDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], DeleteVideoDTO.prototype, "options", void 0);
//# sourceMappingURL=delete-video.dto.js.map