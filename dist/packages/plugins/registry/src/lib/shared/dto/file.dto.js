"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FileDTO {
}
exports.FileDTO = FileDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The field name associated with the file',
        example: 'pluginFile'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Field name must not be empty' }),
    (0, class_validator_1.IsString)({ message: 'Field name must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Field name must not exceed 255 characters' }),
    tslib_1.__metadata("design:type", String)
], FileDTO.prototype, "fieldname", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The file path or identifier of the plugin',
        example: 'plugin-demo-2024.zip',
        pattern: '/\\.(zip)$/'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'File key must not be empty' }),
    (0, class_validator_1.IsString)({ message: 'File key must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'File key must not exceed 255 characters' }),
    (0, class_validator_1.Matches)(/\.(zip)$/, {
        message: 'File must be a valid ZIP format and contain only letters, numbers, spaces, hyphens, or underscores'
    }),
    tslib_1.__metadata("design:type", String)
], FileDTO.prototype, "key", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The original file name',
        example: 'plugin-demo-original.zip'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Original name must not be empty' }),
    (0, class_validator_1.IsString)({ message: 'Original name must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Original name must not exceed 255 characters' }),
    tslib_1.__metadata("design:type", String)
], FileDTO.prototype, "originalname", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The size of the file in bytes',
        example: 10485760
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'File size must not be empty' }),
    (0, class_validator_1.IsNumber)({}, { message: 'File size must be a number' }),
    (0, class_validator_1.IsPositive)({ message: 'File size must be a positive number' }),
    (0, class_validator_1.Min)(1, { message: 'File size must be at least 1 byte' }),
    tslib_1.__metadata("design:type", Number)
], FileDTO.prototype, "size", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The file encoding (if available)',
        example: '7bit'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Encoding must be a string' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Encoding must not exceed 50 characters' }),
    tslib_1.__metadata("design:type", String)
], FileDTO.prototype, "encoding", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The MIME type of the file (if available)',
        example: 'application/zip'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'MIME type must be a string' }),
    (0, class_validator_1.MaxLength)(50, { message: 'MIME type must not exceed 50 characters' }),
    (0, class_validator_1.Matches)(/^application\/(zip)$/, {
        message: 'MIME type must be application/zip'
    }),
    tslib_1.__metadata("design:type", String)
], FileDTO.prototype, "mimetype", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The file name',
        example: 'plugin-demo-2024.zip'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'File name must not be empty' }),
    (0, class_validator_1.IsString)({ message: 'File name must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'File name must not exceed 255 characters' }),
    tslib_1.__metadata("design:type", String)
], FileDTO.prototype, "filename", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The public URL of the file',
        example: 'https://example.com/plugin-demo-2024.zip'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'File URL must not be empty' }),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_tld: false }, { message: 'File URL must be a valid URL' }),
    (0, class_validator_1.MaxLength)(2083, { message: 'File URL must not exceed 2083 characters' }) // 2083 is the maximum URL length in browsers
    ,
    tslib_1.__metadata("design:type", String)
], FileDTO.prototype, "url", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The full path of the file',
        example: '/plugins/plugin-demo-2024.zip'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'File path must not be empty' }),
    (0, class_validator_1.IsString)({ message: 'File path must be a string' }),
    (0, class_validator_1.MaxLength)(1024, { message: 'File path must not exceed 1024 characters' }),
    tslib_1.__metadata("design:type", String)
], FileDTO.prototype, "path", void 0);
//# sourceMappingURL=file.dto.js.map