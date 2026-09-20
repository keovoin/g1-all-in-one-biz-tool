"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camshot = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const core_2 = require("@gauzy/core");
const contracts_1 = require("@gauzy/contracts");
const mikro_orm_camshot_repository_1 = require("../repositories/mikro-orm-camshot.repository");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const PNG_FILE_REGEX = /\.(png)$/;
const PNG_FILE_MESSAGE = 'File must be a valid camshot format png';
let Camshot = class Camshot extends core_1.TenantOrganizationBaseEntity {
};
exports.Camshot = Camshot;
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    (0, class_validator_1.IsString)({ message: 'Title must be a string' }),
    (0, class_validator_1.Length)(3, 255, { message: 'Title must be between 3 and 255 characters' }),
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Title of the camshot' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Camshot.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'File is required' }),
    (0, class_validator_1.IsString)({ message: 'File must be a string' }),
    (0, class_validator_1.Matches)(PNG_FILE_REGEX, { message: PNG_FILE_MESSAGE }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Camshot file path or identifier' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Camshot.prototype, "fileKey", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'File must be a string' }),
    (0, class_validator_1.Matches)(PNG_FILE_REGEX, { message: PNG_FILE_MESSAGE }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Camshot thumb file path or identifier' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Camshot.prototype, "thumbKey", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.FileStorageProviderEnum),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.FileStorageProviderEnum }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'simple-enum', nullable: true, enum: contracts_1.FileStorageProviderEnum }),
    tslib_1.__metadata("design:type", String)
], Camshot.prototype, "storageProvider", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => !!o.recordedAt),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value && new Date(value).getTime() > Date.now()) {
            throw new Error('Recorded date cannot be in the future');
        }
        return new Date(value).toISOString();
    }, { toClassOnly: true }),
    (0, class_validator_1.IsDateString)({}, { message: 'Recorded date must be a valid ISO 8601 date string' }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => 'timestamptz', description: 'Date when the camshot was recorded' }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Camshot.prototype, "recordedAt", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }, { message: 'Full URL must be a valid HTTPS or HTTP URL' }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Full URL to access the camshot' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Camshot.prototype, "fullUrl", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }, { message: 'Thumb URL must be a valid HTTPS or HTTP URL' }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Thumb URL to access the camshot' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Camshot.prototype, "thumbUrl", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Size must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Size must be greater than or equal to 0' }),
    (0, class_validator_1.Max)(5242880, { message: 'Size cannot exceed 5MB.' }),
    (0, class_transformer_1.Transform)(({ value }) => Number.parseFloat(value), { toClassOnly: true }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: 'Size of the camshot file in bytes' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Camshot.prototype, "size", void 0);
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
], Camshot.prototype, "timeSlot", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'TimeSlot ID must be a valid UUID v4' }) // Validates the ID is a proper UUID v4.
    ,
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'The UUID of the associated TimeSlot' }),
    (0, typeorm_1.RelationId)((camshot) => camshot.timeSlot) // Extracts the foreign key for the relationship.
    ,
    (0, core_1.ColumnIndex)() // Adds a database index for faster queries on the timeSlotId column.
    ,
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }) // Marks it as a relation identifier.
    ,
    tslib_1.__metadata("design:type", String)
], Camshot.prototype, "timeSlotId", void 0);
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
], Camshot.prototype, "uploadedBy", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'Employee ID must be a valid UUID v4' }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'The UUID of the associated Employee' }),
    (0, typeorm_1.RelationId)((camshot) => camshot.uploadedBy) // Extracts the foreign key for the relationship.
    ,
    (0, core_1.ColumnIndex)() // Adds a database index for faster queries on the uploadedById column.
    ,
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }) // Marks it as a relation identifier.
    ,
    tslib_1.__metadata("design:type", String)
], Camshot.prototype, "uploadedById", void 0);
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
], Camshot.prototype, "user", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'User ID must be a valid UUID v4' }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'The UUID of the associated User' }),
    (0, typeorm_1.RelationId)((camshot) => camshot.user) // Extracts the foreign key for the relationship.
    ,
    (0, core_1.ColumnIndex)() // Adds a database index for faster queries on the userId column.
    ,
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }) // Marks it as a relation identifier.
    ,
    tslib_1.__metadata("design:type", String)
], Camshot.prototype, "userId", void 0);
exports.Camshot = Camshot = tslib_1.__decorate([
    (0, core_2.MultiORMEntity)('camshots', { mikroOrmRepository: () => mikro_orm_camshot_repository_1.MikroOrmCamshotRepository })
], Camshot);
//# sourceMappingURL=camshot.entity.js.map