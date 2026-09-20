"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const video_model_1 = require("../video.model");
const mikro_orm_video_repository_1 = require("../repositories/mikro-orm-video.repository");
let Video = class Video extends core_1.TenantOrganizationBaseEntity {
};
exports.Video = Video;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Title of the video' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    (0, class_validator_1.IsString)({ message: 'Title must be a string' }),
    (0, class_validator_1.Length)(3, 255, { message: 'Title must be between 3 and 255 characters' }),
    (0, class_validator_1.Matches)(/^[\p{L}\p{N}\s-]+$/u, {
        message: 'Title can contain letters, numbers, spaces, and hyphens from any language'
    }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Video.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Video file path or identifier' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'File is required' }),
    (0, class_validator_1.IsString)({ message: 'File must be a string' }),
    (0, class_validator_1.Matches)(/^[\w-]+\.(mp4)$/i, {
        message: 'File must be a valid MP4 format and contain only letters, numbers, and hyphens'
    }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Video.prototype, "file", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => 'timestamptz', description: 'Date when the video was recorded' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Recorded date must be a valid ISO 8601 date string' }),
    (0, class_validator_1.ValidateIf)((o) => o.recordedAt && o.recordedAt <= new Date()),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Video.prototype, "recordedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, description: 'Duration of the video in seconds' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Duration must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Duration must be greater than or equal to 0' }),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value), { toClassOnly: true }),
    (0, core_1.MultiORMColumn)({ nullable: true, type: 'real' }),
    tslib_1.__metadata("design:type", Number)
], Video.prototype, "duration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, description: 'Size of the video file in bytes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Size must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Size must be greater than or equal to 0' }),
    (0, class_validator_1.Max)(10737418240, { message: 'Size cannot exceed 10GB (10737418240 bytes)' }),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value), { toClassOnly: true }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Video.prototype, "size", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Full URL to access the video' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }, { message: 'Full URL must be a valid HTTPS or HTTP URL' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Video.prototype, "fullUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Video description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.Length)(0, 1000, { message: 'Description must not exceed 1000 characters' }),
    (0, class_validator_1.Matches)(/^[\w\s.,!?-]*$/i, {
        message: 'Description can only contain letters, numbers, spaces, and basic punctuation'
    }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Video.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.FileStorageProviderEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.FileStorageProviderEnum),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'simple-enum', nullable: true, enum: contracts_1.FileStorageProviderEnum }),
    tslib_1.__metadata("design:type", String)
], Video.prototype, "storageProvider", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        description: 'Video resolution in format WIDTH:HEIGHT (e.g., 1920:1080, 3840:2160)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{3,4}:\d{3,4}$/, {
        message: 'Resolution must be in format WIDTH:HEIGHT (e.g., 1920:1080)'
    }),
    (0, core_1.MultiORMColumn)({ nullable: true, default: video_model_1.VideoResolutionEnum.FullHD }),
    tslib_1.__metadata("design:type", String)
], Video.prototype, "resolution", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        description: 'Video codec used for encoding (e.g., libx264, libx265, vp9)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Codec must be a string' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9_-]{2,20}$/, {
        message: 'Codec must be 2-20 characters long and contain only letters, numbers, underscores, and hyphens'
    }),
    (0, core_1.MultiORMColumn)({ nullable: true, default: video_model_1.VideoCodecEnum.libx264 }),
    tslib_1.__metadata("design:type", String)
], Video.prototype, "codec", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, description: 'Video frame rate' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Frame rate must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Frame rate must be at least 1 fps' }),
    (0, class_validator_1.Max)(240, { message: 'Frame rate cannot exceed 240 fps' }),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value), { toClassOnly: true }),
    (0, core_1.MultiORMColumn)({ nullable: true, default: 15 }),
    tslib_1.__metadata("design:type", Number)
], Video.prototype, "frameRate", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.TimeSlot, {
        /** Specifies whether the relation column can have null values. */
        nullable: true,
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)() // Indicates this is the owning side of the relationship and specifies the join column.
    ,
    tslib_1.__metadata("design:type", Object)
], Video.prototype, "timeSlot", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'The UUID of the associated TimeSlot' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'TimeSlot ID must be a valid UUID v4' }) // Validates the ID is a proper UUID v4.
    ,
    (0, typeorm_1.RelationId)((video) => video.timeSlot) // Extracts the foreign key for the relationship.
    ,
    (0, core_1.ColumnIndex)() // Adds a database index for faster queries on the timeSlotId column.
    ,
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }) // Marks it as a relation identifier.
    ,
    tslib_1.__metadata("design:type", String)
], Video.prototype, "timeSlotId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.Employee, {
        /** Specifies whether the relation column can have null values. */
        nullable: true,
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)() // Indicates this is the owning side of the relationship and specifies the join column.
    ,
    tslib_1.__metadata("design:type", Object)
], Video.prototype, "uploadedBy", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((video) => video.uploadedBy) // Extracts the foreign key for the relationship.
    ,
    (0, core_1.ColumnIndex)() // Adds a database index for faster queries on the uploadedById column.
    ,
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }) // Marks it as a relation identifier.
    ,
    tslib_1.__metadata("design:type", String)
], Video.prototype, "uploadedById", void 0);
exports.Video = Video = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('video', { mikroOrmRepository: () => mikro_orm_video_repository_1.MikroOrmVideoRepository })
], Video);
//# sourceMappingURL=video.entity.js.map