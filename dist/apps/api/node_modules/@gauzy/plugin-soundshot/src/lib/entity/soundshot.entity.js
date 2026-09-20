"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Soundshot = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const mikro_orm_soundshot_repository_1 = require("../repositories/mikro-orm-soundshot.repository");
const WEBM_FILE_REGEX = /\.(webm)$/;
const WEBM_FILE_MESSAGE = 'File must be a valid soundshot format webm';
let Soundshot = class Soundshot extends core_1.TenantOrganizationBaseEntity {
};
exports.Soundshot = Soundshot;
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    (0, class_validator_1.Length)(3, 255, { message: 'Name must be between 3 and 255 characters' }),
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Name of the soundshot' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Soundshot.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'File is required' }),
    (0, class_validator_1.IsString)({ message: 'File must be a string' }),
    (0, class_validator_1.Matches)(WEBM_FILE_REGEX, { message: WEBM_FILE_MESSAGE }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Soundshot file path or identifier' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Soundshot.prototype, "fileKey", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.FileStorageProviderEnum),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.FileStorageProviderEnum }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'simple-enum', nullable: true, enum: contracts_1.FileStorageProviderEnum }),
    tslib_1.__metadata("design:type", String)
], Soundshot.prototype, "storageProvider", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => !!o.recordedAt),
    (0, class_transformer_1.Transform)(({ value }) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('Recorded date is invalid');
        }
        if (date.getTime() > Date.now()) {
            throw new Error('Recorded date cannot be in the future');
        }
        return date.toISOString();
    }, { toClassOnly: true }),
    (0, class_validator_1.IsDateString)({}, { message: 'Recorded date must be a valid ISO 8601 date string' }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => 'timestamptz', description: 'Date when the soundshot was recorded' }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Soundshot.prototype, "recordedAt", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }, { message: 'Full URL must be a valid HTTPS or HTTP URL' }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Full URL to access the soundshot' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Soundshot.prototype, "fullUrl", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Size must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Size must be greater than or equal to 0' }),
    (0, class_validator_1.Max)(104857600, { message: 'Size cannot exceed 100MB.' }),
    (0, class_transformer_1.Transform)(({ value }) => Number.parseFloat(value), { toClassOnly: true }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: 'Size of the soundshot file in bytes' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Soundshot.prototype, "size", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Number of audio channels in the soundshot file (e.g., 1 for mono, 2 for stereo).' }),
    (0, class_transformer_1.Transform)(({ value }) => Number.parseInt(value), { toClassOnly: true }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: 'Sound channels of the soundshot file' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Soundshot.prototype, "channels", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Rate must be a number' }),
    (0, class_transformer_1.Transform)(({ value }) => Number.parseInt(value), { toClassOnly: true }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: 'Sound rate of the soundshot file' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Soundshot.prototype, "rate", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Duration must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Duration must be greater than or equal to 0' }),
    (0, class_transformer_1.Transform)(({ value }) => Number.parseFloat(value), { toClassOnly: true }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: 'Duration of the soundshot file in seconds' }),
    (0, core_1.MultiORMColumn)({ nullable: true, type: 'float' }),
    tslib_1.__metadata("design:type", Number)
], Soundshot.prototype, "duration", void 0);
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
], Soundshot.prototype, "timeSlot", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'TimeSlot ID must be a valid UUID v4' }) // Validates the ID is a proper UUID v4.
    ,
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'The UUID of the associated TimeSlot' }),
    (0, typeorm_1.RelationId)((soundshot) => soundshot.timeSlot) // Extracts the foreign key for the relationship.
    ,
    (0, core_1.ColumnIndex)() // Adds a database index for faster queries on the timeSlotId column.
    ,
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }) // Marks it as a relation identifier.
    ,
    tslib_1.__metadata("design:type", String)
], Soundshot.prototype, "timeSlotId", void 0);
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
], Soundshot.prototype, "uploadedBy", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'Employee ID must be a valid UUID v4' }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'The UUID of the associated Employee' }),
    (0, typeorm_1.RelationId)((soundshot) => soundshot.uploadedBy) // Extracts the foreign key for the relationship.
    ,
    (0, core_1.ColumnIndex)() // Adds a database index for faster queries on the uploadedById column.
    ,
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }) // Marks it as a relation identifier.
    ,
    tslib_1.__metadata("design:type", String)
], Soundshot.prototype, "uploadedById", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.User, {
        /** Specifies whether the relation column can have null values. */
        nullable: true,
        /** Specifies the action to take when the related entity is deleted. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)() // Indicates this is the owning side of the relationship and specifies the join column.
    ,
    tslib_1.__metadata("design:type", Object)
], Soundshot.prototype, "user", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'User ID must be a valid UUID v4' }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'The UUID of the associated User' }),
    (0, typeorm_1.RelationId)((soundshot) => soundshot.user) // Extracts the foreign key for the relationship.
    ,
    (0, core_1.ColumnIndex)() // Adds a database index for faster queries on the userId column.
    ,
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }) // Marks it as a relation identifier.
    ,
    tslib_1.__metadata("design:type", String)
], Soundshot.prototype, "userId", void 0);
exports.Soundshot = Soundshot = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('soundshots', { mikroOrmRepository: () => mikro_orm_soundshot_repository_1.MikroOrmSoundshotRepository })
], Soundshot);
//# sourceMappingURL=soundshot.entity.js.map