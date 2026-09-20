"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Screenshot = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const entity_1 = require("../../core/decorators/entity");
const internal_1 = require("./../../core/entities/internal");
const mikro_orm_screenshot_repository_1 = require("./repository/mikro-orm-screenshot.repository");
let Screenshot = class Screenshot extends internal_1.TenantOrganizationBaseEntity {
};
exports.Screenshot = Screenshot;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Screenshot.prototype, "file", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Screenshot.prototype, "thumb", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => 'timestamptz' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Screenshot.prototype, "recordedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.FileStorageProviderEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.FileStorageProviderEnum),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'simple-enum', nullable: true, enum: contracts_1.FileStorageProviderEnum }),
    tslib_1.__metadata("design:type", String)
], Screenshot.prototype, "storageProvider", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        description: 'Specifies whether the image or screenshot is work-related.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Screenshot.prototype, "isWorkRelated", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        description: 'Description of the image or screenshot.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Screenshot.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)() ? 'text' : 'json'),
        description: 'Applications associated with the image or screenshot.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        type: (0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)() ? 'text' : 'json'
    }),
    tslib_1.__metadata("design:type", Object)
], Screenshot.prototype, "apps", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", String)
], Screenshot.prototype, "fullUrl", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", String)
], Screenshot.prototype, "thumbUrl", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.TimeSlot, (it) => it.screenshots, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Screenshot.prototype, "timeSlot", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.timeSlot),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Screenshot.prototype, "timeSlotId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Screenshot.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.user),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Screenshot.prototype, "userId", void 0);
exports.Screenshot = Screenshot = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('screenshot', { mikroOrmRepository: () => mikro_orm_screenshot_repository_1.MikroOrmScreenshotRepository })
], Screenshot);
//# sourceMappingURL=screenshot.entity.js.map