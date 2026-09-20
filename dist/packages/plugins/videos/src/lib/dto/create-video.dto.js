"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVideoDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const base_video_dto_1 = require("./base-video.dto");
const file_dto_1 = require("./file.dto");
class CreateVideoDTO extends base_video_dto_1.BaseVideoDTO {
}
exports.CreateVideoDTO = CreateVideoDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The title of the video',
        example: 'My Project Demo Video 2024',
        minLength: 3,
        maxLength: 255
    }),
    (0, class_validator_1.IsDefined)({ message: 'Title is required and cannot be empty.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    (0, class_validator_1.Length)(3, 255, { message: 'Title must be between 3 and 255 characters' }),
    (0, class_validator_1.Matches)(/^[\w\s-]+$/i, {
        message: 'Title can only contain letters, numbers, spaces, and hyphens'
    }),
    tslib_1.__metadata("design:type", String)
], CreateVideoDTO.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: file_dto_1.FileDTO,
        description: 'The uploaded video file object containing metadata and properties',
        required: true
    }),
    (0, class_validator_1.ValidateNested)({ message: 'File must be a valid FileDTO object' }),
    (0, class_transformer_1.Type)(() => file_dto_1.FileDTO),
    tslib_1.__metadata("design:type", file_dto_1.FileDTO)
], CreateVideoDTO.prototype, "file", void 0);
//# sourceMappingURL=create-video.dto.js.map